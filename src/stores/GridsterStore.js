// Gridster store
// Requiring the Dispatcher, Constants, and
// event emitter dependencies
import AppDispatcher from '../dispatcher/AppDispatcher';
import { GridsterConstants } from '../constants/GridsterConstants.js';
import { EventEmitter } from 'events';
import { parse } from 'querystring';
import { AST_Statement } from 'terser';

EventEmitter.prototype._maxListeners = 200;

const CHANGE_EVENT = 'change';

// Define the store as an empty array
let _store = {
  columns: 10,
  rows: 16,
  grid: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  shapes: [{
      name: 'i',
      shape: [1, 1, 1, 1],
      width: 4,
      height: 1,
    },
    {
      name: 'l',
      shape: [1, 1, 1, 0, 0, 1],
      width: 3,
      height: 2,
    },
    {
      name: 'r',
      shape: [1, 1, 1, 1, 0, 0],
      width: 3,
      height: 2,
    },
    {
      name: 't',
      shape: [1, 1, 1, 0, 1, 0],
      width: 3,
      height: 2,
    },
    {
      name: 'square',
      shape: [1, 1, 1, 1],
      width: 2,
      height: 2,
    }
  ],
  currentItem: [],
  timer: 0,
  state: 0,
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

function clearPath() {
  _store.grid.forEach((element, i) => {
    if (element.path === "connected") {
      element.path = null;
      element.counter = Infinity;
    }
  })
}
//paint path
function connectPath(array) {
  array.forEach((element, i) => {
    element.path = "connected";
  })
}

function checkTop(x, y, targetX, targetY) {
  if (x === targetX && y + 1 === targetY) {
    // console.log('checkstart top');
    return true;
  }
}

function checkRight(x, y, targetX, targetY) {
  if (x === targetX + 1 && y === targetY) {
    // console.log('checkstart right');
    return true;
  }
}

function checkBottom(x, y, targetX, targetY) {
  if (x === targetX && y - 1 === targetY) {
    // console.log('checkstart bottom');
    return true;
  }
}

function checkLeft(x, y, targetX, targetY) {
  if (x === targetX - 1 && y === targetY) {
    // console.log('checkstart left');
    return true;
  }
}

/*
  Takes @cellX and @cellY value and returns
  in addition to @startX and @startY
  And returns true if either top, bottom, left or right
*/
function checkStart(cellX, cellY, startX, startY) {
  // top
  if (checkTop(cellX, cellY, startX, startY)) {
    return true;
  }
  //right
  if (checkRight(cellX, cellY, startX, startY)) {
    return true;
  }
  //bottom
  if (checkBottom(cellX, cellY, startX, startY)) {
    return true;
  }
  // left
  if (checkLeft(cellX, cellY, startX, startY)) {
    return true;
  }
}

function xcoord(number) {
  return (1 + ((number % _store.columns)));
}

function ycoord(number) {
  return (1 + parseInt(number / _store.columns, 10));
}

function addTop() {
  // console.log('this is where we add cells to top or beginning of array', _store.columns);
  // use unshift
  _store.grid.unshift(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
}

/**
 * This function moves everything on the canvas to the right
 * Updates the state in the store
 */
function moveRight() {

  let $first_col_item;
  let $last_col_item;

  for (let rows = _store.rows; rows > 0; rows--) {
    $last_col_item = (rows * _store.columns);
    // console.log($last_col_item);

    $first_col_item = $last_col_item - (_store.columns - 1);
    // console.log($first_col_item);

    _store.grid = removeItem(_store.grid, $last_col_item);
    _store.grid = addItem(_store.grid, $first_col_item, 0);
  }
}

function addItem(items, i, item) {
  let $new = items.splice(i, 0, item);
  return items;
}

/*
 * accepts a an array of @items representing the grid or stage and paints an @item (1 or 0) using the index i
 */
function paintItem(items, i, item) {
  let $new = items.splice(i, 1, item);
  return items;
}

// function unPaintItem(items, i, item) {
//   let $new = items.splice(i, 1, item);
//   // console.log(items);
//   return items;
// }


const removeItem = (items, i) =>
  items.slice(0, i - 1).concat(items.slice(i, items.length));

function moveClockwise() {


}

function chooseRandom() {
  let randShape = Math.floor((Math.random() * _store.shapes.length))
  paintShape(randShape);
}

function paintShape(i) {
  // use for testing shapes
  // lets get a shape
  let shape = _store.shapes[i].shape;
  let shapeWidth = _store.shapes[i].width;

  let startx = parseInt(_store.columns / 2);
  startx = startx - parseInt(shapeWidth / 2);

  shape.forEach(paintShapeItem);

  function paintShapeItem(item, index, arr) {
    // console.log(index, shapeWidth);
    let limit = _store.columns * _store.rows;
    if (index < _store.shapes[i].width) {
      let currentItemIndex = index + startx;
      if (item === 1) {
        if (item < limit) {
          _store.currentItem.push(currentItemIndex);
          paintItem(_store.grid, currentItemIndex, item)
        }
      }
      // console.log(_store.currentItem);
    } else {
      // console.log(_store.columns - _store.shapes[i].width + index + startx);
      let currentItemIndexSecondLine = _store.columns - _store.shapes[i].width + index + startx;
      // console.log(item);
      if (item === 1) {
        if (item < limit) {
          _store.currentItem.push(currentItemIndexSecondLine);
          paintItem(_store.grid, currentItemIndexSecondLine, item)
        }
      }

    }
  }

}

/*
 * used to update an array from grid or canvas
 */
function updatePaintShape(currentItem) {

  currentItem.forEach(paintShapeItem)

  function paintShapeItem(item, index, arr) {
    let limit = _store.columns * _store.rows;
    if (item < limit) {
      paintItem(_store.grid, item, 1);
    }
  }

}

/*
 *  accepts an array of values and removes them from the grid
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
  // console.log(_store.grid);

  let $first_col_item;
  let $last_col_item;

  for (let rows = _store.rows; rows > 0; rows--) {
    $last_col_item = (rows * _store.columns);
    // console.log($last_col_item);

    $first_col_item = $last_col_item - _store.columns + 1;
    // console.log($first_col_item);
    _store.grid = addItem(_store.grid, $last_col_item, 0);

    _store.grid = removeItem(_store.grid, ($first_col_item));
  }
}
// console.log(_store.grid);


function removeBottom() {
  // console.log('number', _store.columns * _store.rows);
  // console.log('this is where we remove cells from bottom or end', (_store.columns * _store.rows) - _store.columns -1);
  _store.grid.splice((_store.columns * _store.rows) - _store.columns - 1, _store.columns);
}

function gravity() {
  //move current item down one

  // console.log(_store.currentItem)
  if (_store.currentItem.length !== 0) {
    // console.log(_store.currentItem.length);
    let tempCurrent = _store.currentItem.map(addGravity);
    // console.log(tempCurrent)
    // clean up
    tempCurrent = tempCurrent.filter(function(element) {
      return element !== undefined;
    });

    // check no value above 160
    _store.currentItem = tempCurrent.slice(0);
    // console.log(_store.currentItem)
  }

}


function addGravity(x, index, arr) {
  let limit = _store.columns * _store.rows;
  if (x + 10 < limit) {
    return x = x + 10;
  } else {
    return;
  }
}

function startGame() {
  // get current time in store and increase by one every second
  // let currentTime = _store.timer;
  console.log(_store.state);

  startTimer();
  _store.state = 1;
  console.log(_store.state);
  // drup current block by one

}

function startTimer() {
  setInterval(() => {
    // console.log(_store.state);
    if (_store.state === 1) {
      _store.timer = _store.timer + 1;
      // console.log(_store.timer);
      //call gravity after every second
      // console.log(_store.currentItem);
      unPaintShape(_store.currentItem);
      gravity();
      updatePaintShape(_store.currentItem);
      GridsterStore.emit(CHANGE_EVENT);
    } else {
      return;
    }
    // console.log(temp);
  }, 1000);
}

// Initialize the singleton to register with the
// dispatcher and export for React components
const GridsterStore = new GridsterStoreClass();

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
      // call function to update store here = add 10 cells to beginning - remove 10 cells at the end
      // removeBottom();
      // unPaintShape(_store.currentItem);
      // gravity();
      // paintShape()
      // updatePaintShape(_store.currentItem)

      // addTop();
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
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.START_GAME:
      // call function to update store here = add 10 cells to beginning - remove 10 cells at the end
      // startGame();
      chooseRandom();
      startGame();
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

      return true;
  }

});

export default GridsterStore;