const express = require('express')
const router = express.Router()
const firebase = require ('../config/firebaseInit')
const sendEmail = require('../sendEmail');

// Get all developers
router.get('/devs', async (req, res) => {
  const snapshot = await firebase.developers.get()
  const records = snapshot.docs.map(doc => doc.data())
  res.status(201).send(records)
})

// Get single developer
router.post('/dev', async (req, res) => {
  const { name } = req.body
  const snapshot = await firebase.developers.where('name', '==', name).get()
  const record = snapshot.docs.map(doc => doc.data())
  res.status(201).send(record)
})

// Get all tasks
router.get('/tasks', async (req, res) => {
  const snapshot = await firebase.tasks.get()
  const records = snapshot.docs.map(doc => {
    let task = doc.data()
    task.id = doc.id
    return task
  })
  res.status(201).send(records)
})

// Create a task
router.post('/tasks', async (req, res) => {
  const { task } = req.body
  firebase.tasks.add({...task})
  sendEmail.taskCreated(task)
  res.status(201).send(`Task ${task.title} saved`)
})

// Get all ongoing tasks per developer
router.post('/findTasksPerDev', async (req, res) => {
  const { name } = req.body
  const snapshot = await firebase.tasks.where('dev', '==', name).get()
  const records = snapshot.docs.map(doc => {
    let task = doc.data()
    task.id = doc.id
    return task
  })
  res.status(201).send(records)
})

// Mark a task as completed
router.post('/finishTask', async (req, res) => {
  const { task } = req.body
  const snapshot = await firebase.tasks.where('title', '==', task.title).where('reqDate', '==', task.reqDate).get()
  const [ recordId ] = snapshot.docs.map(doc => doc.id)
  let taskRef = firebase.tasks.doc(recordId)
  taskRef.update({ status: 'complete' })
  sendEmail.taskFinished(task)
  res.status(201).send('success')
})

// Assign task
router.post('/assignTask', async (req, res) => {
  const { taskObj } = req.body
  const snapshot = await firebase.tasks.where('title', '==', taskObj.task.title).where('reqDate', '==', taskObj.task.reqDate).get()
  const [ recordId ] = snapshot.docs.map(doc => doc.id)
  let taskRef = firebase.tasks.doc(recordId)
  taskRef.update({ dev: taskObj.dev })
  sendEmail.taskAssigned(taskObj)
  res.status(201).send('success')
})

// Get logs per task
router.post('/fetchLogs', async (req, res) => {
  const {id } = req.body
  const snapshot = await firebase.logs.where('taskId', '==', id).get()
  const records = snapshot.docs.map(doc => doc.data())
  res.status(201).send(records)
})

module.exports = router
