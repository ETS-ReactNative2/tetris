import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GridWidget from './components/GridWidget';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <h1 className="App-intro">
          Tetris.
        </h1>
        <p>
          The grid should be set initially to something like 10 x 15;
        </p>
        <GridWidget columns="10" rows="15" />
      </div>
    );
  }
}

export default App;
