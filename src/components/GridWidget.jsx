import React, { Component } from 'react';

import GridsterStore from '../stores/GridsterStore.js';
import Button from './Button';
// import Input from './Input';
import Grid from './Grid';
import { updateRow, updateColumn, generateGrid, generateStart, generateEnd, updateGravity, moveClockwise, startGame, moveRight, moveLeft, keyDown} from '../actions/GridsterActions.js';

// const spanStyle = {
//   marginRight: '1rem',
//   marginTop: '1.2rem',
//   float: 'left'
// }

function inputValidation(value) {
  //check for number input
  if(typeof value === 'number') {
  //check value is <= || 20 > 0
    if(value <= 20 && value > 0){
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export default class GridWidget extends Component {

  constructor(props) {
    super(props);
    this._onChangeCols = this._onChangeCols.bind(this);
    this._onChangeRows = this._onChangeRows.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onGenerateGrid = this._onGenerateGrid.bind(this);
    this._onGravity = this._onGravity.bind(this);
    this._onRight = this._onRight.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this.state = {
      columns: 10,
      rows: 16,
      grid: [],
      timerOn: false,
      timerStart: 0,
      timerTime: 0
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

  _onChangeRows(event) {
    let value = parseInt(event.target.value, 10);
    if (inputValidation(value)) {
      this.setState({
        rows: value
      });
   }
  }

  _onChangeCols(event) {
    let value = parseInt(event.target.value, 10);
    if (inputValidation(value)) {
    this.setState({
      columns: value
    });
   }
  }

  _onGenerateGrid() {
    updateColumn(this.state.columns);
    updateRow(this.state.rows);
    generateGrid();
    generateStart();
    generateEnd();
  }

  _onGravity() {
    updateGravity();
  }

  _onRight() {
    moveRight();
  }

  _onLeft() {
    moveLeft();
  }

  _onRotate() {
    moveClockwise();
  }

  _startGame() {
    // startTimer();
    // console.log(this.state);
    startGame();
  }

  _onKeyDown(e) {
    console.log("key pressed", e);
    keyDown();
  }



  render() {
    const enabled = this.state.state < 1;
    return (
      <div className="container">
        <div className="inner-container" >
          <span className="score">Score: {this.state.score}</span>
          <form>
            <Button text="Left" onclick={this._onLeft} />
            <Button text="Right" onclick={this._onRight} />
            <Button text="Down" onclick={this._onGravity} />
            <Button text="Rotate" onclick={this._onRotate} />
            <Button text="Start" disabled={!enabled} onclick={this._startGame} />
          </form>
        </div>
        <div className="inner-container" >
          <span>{this.state.interval}</span>
          <Grid
            grid={this.state.grid} columns="10" rows="15"
          />
        </div>
    </div>
    );
  }

}

