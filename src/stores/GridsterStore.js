// Gridster store
// Requiring the Dispatcher, Constants, and
// event emitter dependencies
import AppDispatcher from '../dispatcher/AppDispatcher';
import { GridsterConstants } from '../constants/GridsterConstants.js';
import { EventEmitter } from 'events';
import { StartGrid } from './StartGrid';
EventEmitter.prototype._maxListeners = 200;

const CHANGE_EVENT = 'change';

// Define the store as an empty array
let _store = {
  columns: 10,
  rows: 16,
  grid: StartGrid,
  shapes: [{
      name: 'pipe',
      shape: [1, 1, 1, 1],
      width: 4,
      height: 1,
      transformations: {
        ninety: [-9, 0, 9, 18],
        oneeighty: [11, 0, -11, -22],
        twoseventy: [-18, -9, 0, 9],
        threesixty: [22, 11, 0, -11]
      },
      transformations2: {
        ninety: [
          [-1, 1],
          [0, 0],
          [1, -1],
          [2, -2]
        ],
        oneeighty: [
          [1, 1],
          [0, 0],
          [-1, -1],
          [-2, -2]
        ],
        twoseventy: [
          [-2, 2],
          [-1, -1],
          [0, 1],
          [1, -1]
        ],
        threesixty: [
          [2, 2],
          [1, 1],
          [0, 1],
          [-1, -1]
        ]
      }
    },
    {
      name: 'J',
      shape: [1, 1, 1, 0, 0, 1],
      width: 3,
      height: 2,
      transformations: {
        ninety: [-9, 0, 9, -2],
        oneeighty: [11, 0, -20, -11],
        twoseventy: [2, -9, 0, 9],
        threesixty: [11, 20, 0, -11]
      },
    },
    {
      name: 'L',
      shape: [1, 1, 1, 1, 0, 0],
      width: 3,
      height: 2,
      transformations: {
        ninety: [-9, 0, 9, -20],
        oneeighty: [2, 11, 0, -11],
        twoseventy: [20, -9, 0, 9],
        threesixty: [11, 0, -11, -2]
      },
    },
    {
      name: 'T',
      shape: [1, 1, 1, 0, 1, 0],
      width: 3,
      height: 2,
      transformations: {
        ninety: [-9, 0, 9, -11],
        oneeighty: [11, -9, 0, -11],
        twoseventy: [11, -9, 0, 9],
        threesixty: [11, 0, 9, -11]
      },
      transformations2: {
        ninety: [
          [-1, 1],
          [0, 0],
          [1, -1],
          [2, -2]
        ],
        oneeighty: [
          [1, 1],
          [0, 0],
          [-1, -1],
          [-2, -2]
        ],
        twoseventy: [
          [-2, 2],
          [-1, -1],
          [0, 1],
          [1, -1]
        ],
        threesixty: [
          [2, 2],
          [1, 1],
          [0, 1],
          [-1, -1]
        ]
      }
    },
    {
      name: 'square',
      shape: [1, 1, 1, 1],
      width: 2,
      height: 2,
      transformations: {
        ninety: [0, 0, 0, 0],
        oneeighty: [0, 0, 0, 0],
        twoseventy: [0, 0, 0, 0],
        threesixty: [0, 0, 0, 0]
      },
      transformations2: {
        ninety: [
          [-1, 1],
          [0, 0],
          [1, -1],
          [2, -2]
        ],
        oneeighty: [
          [1, 1],
          [0, 0],
          [-1, -1],
          [-2, -2]
        ],
        twoseventy: [
          [-2, 2],
          [-1, -1],
          [0, 1],
          [1, -1]
        ],
        threesixty: [
          [2, 2],
          [1, 1],
          [0, 1],
          [-1, -1]
        ]
      }
    }
  ],
  currentItem: [],
  timer: 0,
  state: 0,
  angle: 0,
  shape: null,
  score: 0,
  interval: 1000,
};

// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class GridsterStoreClass extends EventEmitter {

  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }

  getGrid() {
    return _store;
  }

}

// Initialize the singleton to register with the
// dispatcher and export for React components
const GridsterStore = new GridsterStoreClass();

function xcoord(number) {
  return (1 + ((number % _store.columns)));
}

function ycoord(number) {
  return (1 + parseInt(number / _store.columns, 10));
}

/*
 * accepts a an array of @items representing the grid or stage and paints an @item (1 or 0) using the index i
 */
function paintItem(items, i, item) {
  items.splice(i, 1, item);
  return items;
}

/*
 * accepts a an item from and array of @items representing the grid or stage and paints an @item (0) using the index i
 */
// const removeItem = (items, i) =>
//   items.slice(0, i - 1).concat(items.slice(i, items.length));

function checkColumnZero(currentValue) {
  if (currentValue % _store.columns !== 0 && (currentValue + 1) % _store.columns !== 0) {
    return currentValue;
  }
}

/*
 * returns the value if not in columnOne
 */
function checkColumnOne(currentValue) {
  if ((currentValue - 1) % _store.columns !== 0 && (currentValue + 2) % _store.columns !== 0) {
    return currentValue;
  }
}

/*
 * moves the current item clockwise
 */
function moveClockwise() {
  let shape = _store.shape;
  let angle = _store.angle;
  // let shapeName = _store.shapes[_store.shape].name;
  let currentShape = _store.currentItem.sort(function(a, b) { return a - b });
  let tempCurrent = currentShape.map(checkColumnOne);
  // if current shape has 4 in column 1 return

  tempCurrent = tempCurrent.filter(function(element) {
    return element !== undefined;
  });
  if (tempCurrent.length <= 0) {
    return;
  }
  //let also check if the shape has 3 elements near the side
  // if current shape has 3 or more items that are in column 0 return

  tempCurrent = currentShape.map(checkColumnZero);
  tempCurrent = tempCurrent.filter(function(element) {
    return element !== undefined;
  });
  if (tempCurrent.length <= 1) {
    return;
  }

  switch (angle) {
    case 0:
      let transformArray = _store.shapes[shape].transformations.ninety;
      // takes the current transform array and adds it to the current array
      let sum = currentShape.map(transformCurrentShapeNinety, {
        shape: shape
      });

      _store.angle = 90;
      // need to check if 'new' summed array
      // 2. is on the stage
      // 1. does not match a value that already exists
      // note if exists in current array transform value should be fine
      moveCurrent(sum);
      break;
    case 90:
      transformArray = _store.shapes[shape].transformations.oneeighty;
      sum = currentShape.map(function(num, i) {
        return num + transformArray[i];
      });
      _store.angle = 180;
      moveCurrent(sum);

      break;
    case 180:
      transformArray = _store.shapes[shape].transformations.twoseventy;
      sum = currentShape.map(function(num, i) {
        return num + transformArray[i];
      });
      _store.angle = 270;
      moveCurrent(sum);

      break;
    case 270:
      transformArray = _store.shapes[shape].transformations.threesixty;
      sum = currentShape.map(function(num, i) {
        return num + transformArray[i];
      });
      _store.angle = 0;
      moveCurrent(sum);


      break;
    default:
      _store.angle = 0;

  }
}

/*
 * Accepts an number and transforms this based on its shape and position
 * also assept @param shape
 */
function transformCurrentShapeNinety(num, i, array) {
  let shape = this.shape;

  // let currentShape = array;
  let transformArray = _store.shapes[shape].transformations.ninety;
  // here we can check if transformed array is valid?
  let newNumber = num + transformArray[i];
  if (_store.currentItem.includes(newNumber)) {
    return newNumber;
  } else {
    //check does not hit sides / other blocks
    // if existing shape has 3 or more elements that are in the first column, return

    return newNumber;
  }
}

/*
 * returns a random shape from shape setting
 */
function chooseRandom() {
  let randShape = Math.floor((Math.random() * _store.shapes.length))
  return randShape;
}

// function isOdd(num) { return num % 2; }

/*
 * takes a integer representing the array count of the random shape
 * enables look up of shape based on matching array id
 * paints this shape on the canvas
 */
function paintShape(i) {
  let shape = _store.shapes[i].shape;
  let shapeWidth = _store.shapes[i].width;
  let startx = parseInt(_store.columns / 2);
  startx = startx - parseInt(shapeWidth / 2);
  let starty = startx - 1;
  let startz = startx + 1;
  let startxx = startx + 2;

  // stop game if startx is not available
  if (_store.grid[startx] === 1 || _store.grid[starty] === 1 || _store.grid[startz] === 1 || _store.grid[startxx] === 1) {
    stopGame();
    return;
  } else {
    shape.forEach(paintShapeItem, { startx: startx, i: i });
  }
}

/*
 * used by paintShape to Map a random shape @array onto canvas
 * also stores current shape in currentItem
 */
function paintShapeItem(item, index, arr) {
  let startx = this.startx;
  let i = this.i;
  let limit = _store.columns * _store.rows;
  if (index < _store.shapes[i].width) {
    let currentItemIndex = index + startx;
    if (item === 1) {
      if (item < limit) {
        _store.currentItem.push(currentItemIndex);
        paintItem(_store.grid, currentItemIndex, item)
      }
    }
  } else {
    let currentItemIndexSecondLine = _store.columns - _store.shapes[i].width + index + startx;
    if (item === 1) {
      if (item < limit) {
        _store.currentItem.push(currentItemIndexSecondLine);
        paintItem(_store.grid, currentItemIndexSecondLine, item)
      }
    }

  }
}
/*
 * used to update an array from grid or canvas
 * takes and array of items @currentItem - loops through and paints on the canvas
 */
function updatePaintShape(currentItem) {

  currentItem.forEach(updatePaintShapeItem)

  function updatePaintShapeItem(item, index, arr) {
    let limit = _store.columns * _store.rows;
    if (item < limit) {
      paintItem(_store.grid, item, 1);
    }
  }

}

/*
 *  accepts an array of values and removes them from the grid - sets to 0
 */
function unPaintShape(currentItem) {
  currentItem.forEach(unPaintShapeItem)

  function unPaintShapeItem(item, index, arr) {
    paintItem(_store.grid, item, 0);
  }

}

/**
 * This function moves everything on the canvas to the left
 * Updates the state in the store
 */
function moveLeft() {
  if (_store.currentItem.length !== 0) {
    let initialCurrentLength = _store.currentItem.length;
    let sortedCurrentItem = _store.currentItem.sort(function(a, b) { return b - a });
    let tempCurrent = sortedCurrentItem.map(addLeft);
    tempCurrent = tempCurrent.filter(function(element) {
      return element !== undefined;
    });
    let processedCurrentLength = tempCurrent.length;
    /*
    // check length of new array is the same as initially set
    // if there is a difference it implies that the current
    // block cannot move so we should stop leave as is and
    // render a new random shape
    */
    if (initialCurrentLength === processedCurrentLength) {
      moveCurrent(tempCurrent);
    }
  }
}

/**
 * This function moves everything on the canvas to the left
 * Updates the state in the store
 */
function moveRight() {
  if (_store.currentItem.length !== 0) {
    let initialCurrentLength = _store.currentItem.length;
    let sortedCurrentItem = _store.currentItem.sort(function(a, b) { return b - a });
    let tempCurrent = sortedCurrentItem.map(addRight);
    //remove items where value is undefined
    tempCurrent = tempCurrent.filter(function(element) {
      return element !== undefined;
    });
    let processedCurrentLength = tempCurrent.length;
    /*
    // check length of new array is the same as initially set
    // if there is a difference it implies that the current
    // block cannot move so we should stop leave as is and
    // render a new random shape
    */
    if (initialCurrentLength === processedCurrentLength) {
      moveCurrent(tempCurrent);
    }
  }
}

/*
 * this is where we remove cells from bottom or end
 */
// function removeBottom() {
//   _store.grid.splice((_store.columns * _store.rows) - _store.columns - 1, _store.columns);
// }

/**
 * Adds a row of blanks cells to the start of the _store.grid
 * depending on the amount of columns in the grid
 */
function addTop() {
  let columns = _store.columns;
  for (let i = 0; i < columns; i++) {
    _store.grid.unshift(0);
  }
}

/*
 * moves the _store.currentItem down one
 */
function moveDown() {
  if (_store.currentItem.length !== 0) {
    let initialCurrentLength = _store.currentItem.length;
    let sortedCurrentItem = _store.currentItem.sort(function(a, b) { return b - a });
    let tempCurrent = sortedCurrentItem.map(addGravity);
    //remove items where value is undefined
    tempCurrent = tempCurrent.filter(function(element) {
      return element !== undefined;
    });
    let processedCurrentLength = tempCurrent.length;
    /*
    // check length of new array is the same as initially set
    // if there is a difference it implies that the current
    // block cannot move so we should stop leave as is and
    // render a new random shape
    */
    if (initialCurrentLength === processedCurrentLength) {
      moveCurrent(tempCurrent);
    } else {
      dropNext();
    }
  }
}

/*
 * Used to unpaint current item
 * update the currentItem in the store
 * update the new curreent shape and print on the canvas
 */
function moveCurrent(tempCurrent) {
  unPaintShape(_store.currentItem);
  _store.currentItem = tempCurrent.slice(0);
  updatePaintShape(_store.currentItem);
}

/*
 * start again
 */
function dropNext() {
  // reset current item
  _store.currentItem.length = 0;
  //check for filled rows
  checkRows();
  //choose random shape
  let randShape = chooseRandom();
  _store.shape = randShape;
  _store.angle = 0;
  paintShape(randShape);
}

/*
 * checks for any filled rows
 */
function checkRows() {
  let tempGrid = _store.grid;

  //counts through from high to low
  for (let i = 0; i < _store.rows; i++) {

    let tempLength = tempGrid.length;

    let temp = tempGrid.slice(tempLength - ((_store.columns * i) + _store.columns), tempLength - (_store.columns * i));

    //check each row for alll matching ones
    let count = 0;
    //counts through from high to low
    for (let j = 0; j < _store.columns; j++) {

      let tempj = temp.slice((temp.length - 1) - j)[0];
      if (tempj === 1) {
        count = count + 1;

      }
    }
    /* 1. get the row of items and remove from the
     * 2. insert rows at the top
     */
    if (count === 10) {
      _store.score = _store.score + 10;

      let tempLength2 = _store.grid.length;
      _store.grid.splice(tempLength2 - ((_store.columns * i) + _store.columns), _store.columns);
      addTop();
      decreaseInterval();
      startTimer();
      // not always removing multiple rows ?
    }
  }

}


/*
 * item - should match the index in the stage
 * used by map to add increase each item so that it moves down one row
 */
function addGravity(item, index, arr) {
  let limit = _store.columns * _store.rows;
  if (item < (_store.grid.length - _store.columns)) {
    //add check to see if exists in currentItem, then we don't want to check for 1
    if (_store.currentItem.includes(item + _store.columns)) {
      if (item + _store.columns < limit) {
        return item = item + _store.columns;
      }
    } else {
      if (_store.grid[item + _store.columns] !== 1) {
        if (item + _store.columns < limit) {
          return item = item + _store.columns;
        }
      } else {
        return;
      }
    }
  } else {
    return;
  }
}

/*
 * item - should match the index in the stage
 * used by map to add increase each item so that it moves down one row
 */
function addLeft(item, index, arr) {
  // yes so if current shape has an item that is (index) % number_columns == 0
  // then we cannot move left
  //e.g. 0 1 2 3 4 5 6 7 8 9
  //     10 11 12 13 14 15 16 17 18 19 20
  // e.g. 0000111000
  //      0000010000
  // 4, 5, 6, 15 become
  // 3 , 4, 5, 14

  if (_store.currentItem.includes(item - 1)) {
    return item = item - 1;
  } else {
    //check if first column
    if (item % _store.columns !== 0) {
      // need to also check if element already exists in grid
      if (_store.grid[item - 1] !== 1) {
        return item = item - 1;
      } else {
        return;
      }
    } else {
      return;
    }
  }
}

/*
 * item - should match the index in the stage
 * used by map to add increase each item so that it moves across one column
 */
function addRight(item, index, arr) {
  if (_store.currentItem.includes(item + 1)) {
    return item = item + 1;
  } else {
    //check if first column
    if ((item + 1) % _store.columns !== 0) {
      // need to also check if element already exists in grid
      if (_store.grid[item + 1] !== 1) {
        return item = item + 1;
      } else {
        return;
      }
    } else {
      return;
    }
  }

}

/*
 * starts game and sets state of game to 1
 */
function startGame() {
  clearGrid();
  //clear the grid here
  let randShape = chooseRandom();
  _store.shape = randShape;
  _store.angle = 0;
  setInitialInterval();
  paintShape(randShape);
  _store.state = 1;
}

/*
 * clear grid
 */
function clearGrid() {
  _store.grid = StartGrid.slice(0);
}

/*
 * stop game
 */
function stopGame() {
  _store.state = 0;
}

/*
 * make decreace the applications interval state
 */
function decreaseInterval() {
  _store.interval = _store.interval - (_store.interval * .1);
  clearInterval(gameInterval);
}

/*
 * reset decreace the applications interval state
 */
function setInitialInterval() {
  _store.interval = 1000;
}

//declare in global scope
var gameInterval;
/*
 * start timer
 */
function startTimer() {
  gameInterval = window.setInterval(startTimerCallback, _store.interval);
}


/*
 * start timer calback
 */
function startTimerCallback() {
  if (_store.state === 1) {
    _store.timer = _store.timer + 1;
    moveDown();
    GridsterStore.emit(CHANGE_EVENT);
  } else {
    return;
  }
}

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a
// change
AppDispatcher.register((payload) => {

  const action = payload.action;

  switch (action.actionType) {

    case GridsterConstants.UPDATE_ITEM:

      _store.grid.push(action.value);
      GridsterStore.emit(CHANGE_EVENT);

      break;

    case GridsterConstants.UPDATE_ROW:

      _store.rows = action.value;
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.UPDATE_COL:

      _store.columns = action.value;
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.UPDATE_GRAVITY:
      moveDown();

      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.MOVE_RIGHT:
      // call function to update store here = add 10 cells to beginning - remove 10 cells at the end
      moveRight();
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.MOVE_LEFT:
      // call function to update store here = add 10 cells to beginning - remove 10 cells at the end
      moveLeft();
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.MOVE_CLOCKWISE:
      // call function to update store here = add 10 cells to beginning - remove 10 cells at the end
      moveClockwise();
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.START_GAME:
      // call function to update store here = add 10 cells to beginning - remove 10 cells at the end
      startGame();
      if (_store.timer === 0) {
        startTimer();
      }

      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.GENERATE_GRID:

      let total = _store.columns * _store.rows;

      let newCells = [];

      for (let i = 0; i < total; i++) {
        newCells.push({ 'id': i, 'clicked': "false", 'state': "initial", 'x': xcoord(i), 'y': ycoord(i), 'path': null, 'flag': false, 'counter': Infinity });
      }

      _store.grid = newCells;

      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.GENERATE_CLICK:

      let clickIndex = _store.grid.findIndex((obj => obj.id === parseInt(action.value, 10)));

      if (_store.grid[clickIndex].clicked === "false" && clickIndex !== _store.start.id && clickIndex !== _store.end.id) {
        _store.grid[clickIndex].clicked = "true";
      } else if (_store.grid[clickIndex].clicked === "true" && clickIndex !== _store.start.id && clickIndex !== _store.end.id) {
        _store.grid[clickIndex].clicked = "false";
        //
      }

      GridsterStore.emit(CHANGE_EVENT);

      break;


    case GridsterConstants.MOUSE_ENTER:

      let enterIndex = _store.grid.findIndex((obj => obj.id === parseInt(action.value, 10)));

      _store.grid[enterIndex].state = "hover";

      GridsterStore.emit(CHANGE_EVENT);

      break;

    case GridsterConstants.MOUSE_EXIT:

      let exitIndex = _store.grid.findIndex((obj => obj.id === parseInt(action.value, 10)));

      _store.grid[exitIndex].state = "initial";

      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.MOUSE_DOWN:

      let downIndex = _store.grid.findIndex((obj => obj.id === parseInt(action.value, 10)));

      _store.grid[downIndex].state = "down";

      GridsterStore.emit(CHANGE_EVENT);
      break;

    default:
      return;
  }

});

export default GridsterStore;