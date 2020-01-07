const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const port = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(fileUpload());

const firebase = require('./routes/queryDB');
const poke = require('./routes/poke');
const sendMsg = require('./routes/sendMsg');

app.use('/api/firebase', firebase)
app.use('/api/poke', poke)
app.use('/api/sendMsg', sendMsg)

if(process.env.NODE_ENV ===  'production') {
  app.use(express.static('client/build'))

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(port, () => console.log(`Listening on port ${port}`))
