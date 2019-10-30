import React, { Component } from 'react';
import PropTypes from 'prop-types';

const inputStyle = {
  marginLeft: '.4rem',
  borderRadius: '.4rem',
  border: 'solid 1px #ccc',
  padding: '.4rem',
  maxWidth: '4rem',
  float: 'left',
  margin: '0',
  clear: 'left',
  fontSize: '.8rem'
}

const labelStyle = {
  fontSize: '.8rem',
  display: 'inline-block',
  float: 'left',
  marginRight: '1rem'
}

const spanStyle = {
  display: 'inline-block',
  float: 'left'
}

export default class Input extends Component {

  render() {
    return (
      <label style={labelStyle}>
        <span style={spanStyle}>
        {this.props.name}
        </span>
        <input style={inputStyle}
          type="number"
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.onchange}
          autoFocus="true"
        />
      </label>
    );
  }
}

Input.propTypes = {
  text: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func
};
