import React, { Component } from 'react'
import Lottie from 'react-lottie'
import animationData from '../data/joyful.json'

class UncontrolledLottie extends Component {


  render(){

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        scaleMode: 'noScale'
      }
    };

    return(
      <div className={'App-lottie'}>
        <Lottie options={defaultOptions} />
      </div>
    )
  }
}

export default UncontrolledLottie