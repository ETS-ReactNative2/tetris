import React, { Component } from 'react';
import PropTypes from 'prop-types';

// const buttonStyle = {
//   marginLeft: '.4rem',
//   borderRadius: '.4rem',
//   border: 'solid 1px #ccc',
//   padding: '0.4rem 1rem',
// 	margin: '0 1rem',
// 	cursor: 'pointer',
//   marginTop: '11px'
// }

export default class Button extends Component {

  constructor(props) {
    super(props);
    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);

    this.state = {
      state: "default"
    };
      console.log('this.state', this.state)

  }

  _onMouseEnter(event) {
    // mouseEnter(event.target.id);
    console.log('mouse eneter');
    return this.setState({state: "hover"});

  }

  _onMouseLeave(event) {
    // mouseExit(event.target.id);
        console.log('mouse leave');
        return this.setState({state: "default"});
    console.log('this.state state', this.state.state)

  }

  _onMouseDown(event) {
    // mouseDown(event.target.id);
        console.log('mouse down');
        return this.setState({state: "down"});

  }

  render() {

    let itemColour = '#4a90e2';
    if (this.state.state === "default"){
      itemColour = '#4a90e2';
    }
    if (this.state.state === "hover"){
      itemColour = '#76b5ff';
    }
    if (this.state.state === "down"){
      itemColour = '#235896';
    }

    return (

        <button
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
          onMouseDown={this._onMouseDown}
          type="button"
          onClick={this.props.onclick}
          style={{
              marginLeft: '.4rem',
              borderRadius: '.4rem',
              border: 'solid 1px #ccc',
              padding: '0.4rem 1rem',
              color: 'white',
              fontSize: '1rem',
              margin: '0 1rem',
              marginTop: '13px',
              cursor: 'pointer',
              background: itemColour}}>
          {this.props.text}
        </button>

    );
  }

}

Button.propTypes = {
  text: PropTypes.string
};
