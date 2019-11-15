import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import GridWidget from './components/GridWidget';
import UncontrolledLottie from './components/UncontrolledLottie';

// import MIDISounds from 'midi-sounds-react';

class App extends Component {
  render() {
    return ( <div className = "App" >
      {/* <header className = "App-header" >
      <img src = { logo }
      className = "App-logo"
      alt = "logo" />
      </header> */}
      <h1 className = "App-intro" >Tetris. </h1>
      {/* <p className="App-intro">Press Play to play instrument sound.</p> */}
      {/* <p><button onClick={this.playTestInstrument.bind(this)}>Play</button></p> */}
        {/* <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" drums={[0]}  /> */}

      <p>Use can use the arrow keys to move the block around.</p>
      <div className="container-lottie" >
        <UncontrolledLottie></UncontrolledLottie>

      </div>
        <GridWidget columns = "10"
      rows = "15" />
      </div>
    );
  }
}

export default App;