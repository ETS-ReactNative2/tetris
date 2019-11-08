import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GridsterStore from '../stores/GridsterStore.js';

import { generateClick, mouseEnter, mouseExit, mouseDown } from '../actions/GridsterActions.js';

export default class GridItem extends Component {

  constructor(props) {
    super(props);
    this._widthCalc = this._widthCalc.bind(this);
    this._onChange = this._onChange.bind(this);
    // this._onClick = this._onClick.bind(this);
    // this._onMouseEnter = this._onMouseEnter.bind(this);
    // this._onMouseLeave = this._onMouseLeave.bind(this);
    // this._onMouseDown = this._onMouseDown.bind(this);

    this.state = {
      columns: 8,
      rows: 12
    };
  }

  componentDidMount() {
    GridsterStore.addChangeListener(this._onChange);
    this.setState(GridsterStore.getGrid());
  }

  componentWillUnmount() {
    GridsterStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(GridsterStore.getGrid());
  }

	_widthCalc(x) {
		return 100 / x;
	}

  _onClick(event) {
    generateClick(event.target.id);
    // shortPath();
  }

  _onMouseEnter(event) {
    mouseEnter(event.target.id);
  }

  _onMouseLeave(event) {
    mouseExit(event.target.id);
  }

  _onMouseDown(event) {
    mouseDown(event.target.id);
  }

  render() {

    let itemColour = '#F1F1F1';

    if (this.state.grid !== undefined && this.props.text === 1) {
      itemColour = 'rgba(1, 1, 1, .7)';
    }

   return (

    <li
      id={this.props.id}
      // onClick={this._onClick}
      // onMouseEnter={this._onMouseEnter}
      // onMouseLeave={this._onMouseLeave}
      // onMouseDown={this._onMouseDown}
      // clicked={this.state.clicked}
      style={{
        display: 'inline-block',
        float: 'left',
        width: this._widthCalc(this.state.columns)+'%',
        background: itemColour,
        cursor: 'pointer',
        paddingBottom: this._widthCalc(this.state.columns)+'%',
        outline: 'solid 1px rgba(0, 0, 0, 0.2)'}}>
    </li>

    );

  }

}

GridItem.propTypes = {
  id: PropTypes.number
};
