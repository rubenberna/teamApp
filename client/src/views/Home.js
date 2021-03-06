import React, { Component } from 'react'

import './views.scss'
import Gallery from '../components/galery/Galery'
import NewTaskForm from '../components/forms/NewTaskForm'

class Home extends Component {
  render() {
    return(
      <div className='home container'>
        <Gallery devs={this.props.devs} />
        <NewTaskForm/>
      </div>
    )
  }
}

export default Home;
