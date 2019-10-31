// Gridster store
// Requiring the Dispatcher, Constants, and
// event emitter dependencies
import AppDispatcher from '../dispatcher/AppDispatcher';
import { GridsterConstants } from '../constants/GridsterConstants.js';
import { EventEmitter } from 'events';
import { parse } from 'querystring';

EventEmitter.prototype._maxListeners = 200;

const CHANGE_EVENT = 'change';

// Define the store as an empty array
let _store = {
  columns: 10,
  rows: 16,
  grid: [
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
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
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
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
  ]
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


/*
  iterates through @unvisited cells
  starting at @end cell until it is next to @start cell
  i.e. 0, 0+1, 0+1+1, 0+1+1+1
  until count item is next to end
  || if not available i.e cell end is not end, and none other available return
  // needs to fail if next item is not one more htan previous!!!
*/
function isPath(unvisited, end, start) {

  let counter = 0;
  let countedCells = [];

  let match = false;
  let next = true;

  while (match === false && next === true) {

    let uncountedItems = unvisited.filter((obj => (obj.counter > counter)));

    if (uncountedItems.length === 0) {
      next = false;
    }
    //queue is array object where counter = counter
    let matchedItems = _store.grid.filter((obj => (obj.counter === counter)));
    // if (matchedItems.length > 1) {
    //   console.log('matched items more than one');
    //   console.log('matchedItems', matchedItems);
    // }
    if (matchedItems.length === 0) {
      next = false;
    }
    if (matchedItems.length !== 0 && start.length !== 0 && uncountedItems.length !== 0) {

      matchedItems.forEach(function(matchCell) {
        //iterate through start array
        //only one item
        start.forEach(function(startCell) {

          uncountedItems.forEach(function(element) {

            if (checkTop(element.x, element.y, matchCell.x, matchCell.y)) {
              element.counter = counter + 1;
              countedCells.push(element);
              if (checkStart(element.x, element.y, startCell.x, startCell.y)) {
                match = true;
              }
            }

            if (checkRight(element.x, element.y, matchCell.x, matchCell.y)) {
              element.counter = counter + 1;
              countedCells.push(element);
              if (checkStart(element.x, element.y, startCell.x, startCell.y)) {
                match = true;
              }
            }

            if (checkBottom(element.x, element.y, matchCell.x, matchCell.y)) {
              element.counter = counter + 1;
              countedCells.push(element);
              if (checkStart(element.x, element.y, startCell.x, startCell.y)) {
                match = true;
              }
            }

            if (checkLeft(element.x, element.y, matchCell.x, matchCell.y)) {
              element.counter = counter + 1;
              countedCells.push(element);
              if (checkStart(element.x, element.y, startCell.x, startCell.y)) {
                match = true;
              }
            }

          })
        })
      })

      counter = counter + 1;

    }

  }

  if (match === true) {
    return true;
  }

}

function shortestPath(counted, end, start) {

  let counter = 0;

  counted.forEach(function(count) {
    if (count.counter > counter) {
      counter = count.counter;
    }
  })

  //  if count = 8 from end make start.counter = 9
  start[0].counter = counter + 1;

  //Now, start at S (7) and go to the nearby cell with the lowest number (unchecked cells cannot be moved to). The path traced is (1,3,7) -> (1,4,6) -> (1,5,5) -> (1,6,4) -> (1,7,3) -> (1,8,2) -> (2,8,1) -> (3,8,0). In the event that two numbers are equally low (for example, if S was at (2,5)), pick a random direction – the lengths are the same. The algorithm is now complete.

  let shortestPath = [];

  while (counter > 0) {

    if (shortestPath.length === 0 && start.length !== 0 && counted.length !== 0) {

      start.forEach(function(startCell) {

        counted.forEach(function(item, i) {
          // top
          if (checkTop(item.x, item.y, startCell.x, startCell.y)) {
            if (item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //right
          if (checkRight(item.x, item.y, startCell.x, startCell.y)) {
            if (item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //bottom
          if (checkBottom(item.x, item.y, startCell.x, startCell.y)) {
            if (item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //left
          if (checkLeft(item.x, item.y, startCell.x, startCell.y)) {
            if (item.counter === counter) {
              shortestPath.push(item);
            }
          }

        })
      })
    }

    let lowestNumber = Infinity;
    // get neighboure - for each neighbour take the lowest count ...
    if (shortestPath.length !== 0) {
      shortestPath.forEach(function(cell, c) {
        if (cell.counter < lowestNumber) {
          lowestNumber = cell.counter;
        }
      })
    }

    // container for lowest items
    let nextLowest = [];
    if (shortestPath.length !== 0) {
      //take item with least count ....
      shortestPath.forEach(function(cell, c) {
        if (cell.counter === lowestNumber) {
          nextLowest.push(cell);
        }
      })
    }

    if (nextLowest.length > 1) {
      console.log('nextLowest more than one ', nextLowest);
    }
    if (nextLowest.length !== 0 && counted.length !== 0) {

      counted.forEach(function(item) {

        nextLowest.forEach(function(nextItem) {
          // top
          if (checkTop(item.x, item.y, nextItem.x, nextItem.y)) {
            if (item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //right
          if (checkRight(item.x, item.y, nextItem.x, nextItem.y)) {
            if (item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //bottom
          if (checkBottom(item.x, item.y, nextItem.x, nextItem.y)) {
            if (item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //left
          if (checkLeft(item.x, item.y, nextItem.x, nextItem.y)) {
            if (item.counter === counter) {
              shortestPath.push(item);
            }
          }

        })
      })

    }

    counter = counter - 1;

  }

  if (counter === 0 && shortestPath.length !== 0) {
    shortestPath.forEach(function(cell) {
      if (cell.counter === 1) {
        // console.log("Paint Shortest Path");
        // clearPath();
        connectPath(shortestPath);
      }
    })
  }

  if (counter === 0) {
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

function paintItem(items, i, item) {
  let $new = items.splice(i, 1, item);
  return items;
}

const removeItem = (items, i) =>
  items.slice(0, i - 1).concat(items.slice(i, items.length));

function moveClockwise() {
  // use for testing shapes
  // lets get a shape
  // let shape = _store.shapes[0].shape;
  // let shapeWidth = _store.shapes[0].width;
  // let shapeHeigth = _store.shapes[0].height;
  // console.log(shape);
  // console.log(shapeWidth);
  // console.log(shapeHeigth);
  // // add shape to canvas
  // // start with top centre
  // //calc center top
  // let startx = parseInt(_store.columns / 2);
  // startx = startx - parseInt(shapeWidth / 2);
  // console.log(startx);
  // take stage and add our
  console.log(_store.shapes.length);
  let randShape = Math.floor((Math.random() * _store.shapes.length))
  paintShape(randShape);
}

function paintShape(i) {
  // use for testing shapes
  // lets get a shape
  let shape = _store.shapes[i].shape;
  let shapeWidth = _store.shapes[i].width;
  let shapeHeigth = _store.shapes[i].height;
  console.log(shape);
  console.log(shapeWidth);
  console.log(shapeHeigth);
  // add shape to canvas
  // start with top centre
  //calc center top
  let startx = parseInt(_store.columns / 2);
  startx = startx - parseInt(shapeWidth / 2);
  console.log(startx);

  let shapeLength = shape.length;
  console.log(shapeLength);
  shape.forEach(myFunction)

  function myFunction(item, index, arr) {
    console.log(index, shapeWidth);
    if (index < shapeWidth) {
      paintItem(_store.grid, index + startx, item)
    } else {
      paintItem(_store.grid, _store.columns - shapeWidth + index + startx, item)
    }
  }
  // for (let height = shapeHeigth; height > 0; height--) {
  //   for (let width = shapeWidth; width > 0; width--) {
  //     console.log()
  //   }
  // }



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
      removeBottom();
      addTop();
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

      // on click check for connection
      let unVisited = _store.grid.filter((obj => (obj.clicked === "true")));

      let end = _store.grid.filter((obj => (obj.clicked === "end")));

      let start = _store.grid.filter((obj => (obj.clicked === "start")));

      // isEndVisited(unVisited, end, start);

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