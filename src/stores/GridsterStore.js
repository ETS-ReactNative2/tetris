// Gridster store
// Requiring the Dispatcher, Constants, and
// event emitter dependencies
import AppDispatcher from '../dispatcher/AppDispatcher';
import { GridsterConstants } from '../constants/GridsterConstants.js';
import { EventEmitter }from 'events';

EventEmitter.prototype._maxListeners = 200;

const CHANGE_EVENT = 'change';

// Define the store as an empty array
let _store = {
  columns: 10,
  rows: 10,
  grid: []
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
    if (element.path === "connected"){
      element.path = null;
      // element.distance = Infinity;
      element.counter = Infinity;
      // element.visited = "unvisited";
    }
  })
}
//paint path
function connectPath(array) {
  array.forEach((element, i) => {
    element.path = "connected";
  })
}

function checkTop(x, y, targetX, targetY){
  if(x === targetX && y + 1 === targetY ){
    // console.log('checkstart top');
    return true;
  }
}

function checkRight(x, y, targetX, targetY){
  if(x === targetX + 1 && y === targetY ){
    // console.log('checkstart right');
    return true;
  }
}

function checkBottom(x, y, targetX, targetY){
  if(x === targetX && y - 1 === targetY ){
    // console.log('checkstart bottom');
    return true;
  }
}

function checkLeft(x, y, targetX, targetY){
  if(x === targetX - 1 && y === targetY ){
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
  if(checkTop(cellX, cellY, startX, startY)) {
    return true;
  }
  //right
  if(checkRight(cellX, cellY, startX, startY)) {
    return true;
  }
  //bottom
  if(checkBottom(cellX, cellY, startX, startY)) {
    return true;
  }
  // left
  if(checkLeft(cellX, cellY  , startX, startY)) {
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

    let uncountedItems = unvisited.filter((obj => (obj.counter > counter) ));

    if(uncountedItems.length === 0) {
      next = false;
    }
    //queue is array object where counter = counter 
    let matchedItems = _store.grid.filter((obj => (obj.counter === counter) ));
    // if (matchedItems.length > 1) {
    //   console.log('matched items more than one');
    //   console.log('matchedItems', matchedItems);
    // }
    if(matchedItems.length === 0) {
      next = false;
    }
    if(matchedItems.length !== 0 && start.length !== 0 && uncountedItems.length !== 0) {

      matchedItems.forEach(function(matchCell) {
        //iterate through start array
        //only one item
        start.forEach(function(startCell) {

          uncountedItems.forEach(function(element) {

            if(checkTop(element.x, element.y, matchCell.x, matchCell.y)) {
              element.counter = counter + 1;
              countedCells.push(element);
              if (checkStart(element.x, element.y, startCell.x, startCell.y)) {
                match = true;
              }
            }

            if(checkRight(element.x, element.y, matchCell.x, matchCell.y)) {
              element.counter = counter + 1;
              countedCells.push(element);
              if (checkStart(element.x, element.y, startCell.x, startCell.y)) {
                match = true;
              }
            }

            if(checkBottom(element.x, element.y, matchCell.x, matchCell.y)) {
              element.counter = counter + 1;
              countedCells.push(element);
              if (checkStart(element.x, element.y, startCell.x, startCell.y)) {
                match = true;
              }
            }

            if(checkLeft(element.x, element.y, matchCell.x, matchCell.y)) {
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

  if (match === true ) {
    return true;
  }

}

function shortestPath(counted, end, start) {

  let counter = 0;

  counted.forEach(function(count) {
    if(count.counter > counter) {
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

        counted.forEach(function(item, i){
           // top
          if(checkTop(item.x, item.y, startCell.x, startCell.y)) {
            if(item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //right
          if(checkRight(item.x, item.y, startCell.x, startCell.y)) {
            if(item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //bottom
          if(checkBottom(item.x, item.y, startCell.x, startCell.y)) {
            if(item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //left
          if(checkLeft(item.x, item.y, startCell.x, startCell.y)) {
            if(item.counter === counter) {
              shortestPath.push(item);
            }
          }

        })
      })
    }

    let lowestNumber = Infinity;
    // get neighboure - for each neighbour take the lowest count ...
    if(shortestPath.length !== 0){
      shortestPath.forEach(function(cell, c){
        if (cell.counter < lowestNumber) {
          lowestNumber = cell.counter;
        }
      })
    }

    // container for lowest items
    let nextLowest = [];
    if(shortestPath.length !== 0){
      //take item with least count ....
      shortestPath.forEach(function(cell, c) {
        if (cell.counter === lowestNumber) {
          nextLowest.push(cell);
        }
      })
    }

    if(nextLowest.length > 1) {
      console.log('nextLowest more than one ', nextLowest);
    }
    if(nextLowest.length !==0 && counted.length !==0) {

      counted.forEach(function(item){

        nextLowest.forEach(function(nextItem){
          // top
          if(checkTop(item.x, item.y, nextItem.x, nextItem.y)) {
            if(item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //right
          if(checkRight(item.x, item.y, nextItem.x, nextItem.y)) {
            if(item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //bottom
          if(checkBottom(item.x, item.y, nextItem.x, nextItem.y)) {
            if(item.counter === counter) {
              shortestPath.push(item);
            }
          }
          //left
          if(checkLeft(item.x, item.y, nextItem.x, nextItem.y)) {
            if(item.counter === counter) {
              shortestPath.push(item);
            }
          }

        })
      })

    }

    counter = counter - 1;

  }

  if(counter === 0 && shortestPath.length !== 0 ) {
    shortestPath.forEach(function(cell) {
      if(cell.counter === 1 ) {
        // console.log("Paint Shortest Path");
        // clearPath();
        connectPath(shortestPath);
      }
    })
  }

  if (counter === 0 ) {
    return true;
  }

}

function pathFinder(unvisited, end, start) {

  if (isPath(unvisited, end, start)) {

    let countedCells = _store.grid.filter((obj => (obj.counter !== Infinity && obj.clicked !== "end") ));

    if (shortestPath(countedCells, end, start)) {
      console.log('Found shortest path!!')
    }

  }

}

/*
  accepts array of objects  
  if one of @unvisited cells is next to @end
  if match calls pathFinder function passing, @unvisited cells, @start and @end
*/
function isEndVisited(unvisited, end, start) {
  //clear path to start
  clearPath();
  //need some way of checking if path exits before as we have no way of knowing
  if(end.length > 1) {
    console.log('multiple ends!!');
  }

  if(unvisited.length !== 0 && end.length !== 0) {

    end.forEach(function(enditem, j) {

      unvisited.forEach(function(element, i) {
        // top
        if(checkTop(element.x, element.y, enditem.x, enditem.y)) {
          pathFinder(unvisited, end, start);
        }
         // right
        if(checkRight(element.x, element.y, enditem.x, enditem.y)) {
          pathFinder(unvisited, end, start);
        }
        // bottom
        if(checkBottom(element.x, element.y, enditem.x, enditem.y)) {
          pathFinder(unvisited, end, start);
        }
        // left
        if(checkLeft(element.x, element.y, enditem.x, enditem.y)) {
          pathFinder(unvisited, end, start);
        }

      })

    })

  }
}

function xcoord(number) {
  return ( 1 + ((number%_store.columns)));
}

function ycoord(number) {
  return ( 1 + parseInt(number/_store.columns, 10));
}

// Initialize the singleton to register with the
// dispatcher and export for React components
const GridsterStore = new GridsterStoreClass();

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a
// change
AppDispatcher.register((payload) => {

  const action = payload.action;

  switch(action.actionType) {

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

    case GridsterConstants.GENERATE_GRID:

      let total = _store.columns * _store.rows;

      let newCells = [];

      for(let i=0;i<total;i++){
        newCells.push({'id': i, 'clicked' : "false", 'state': "initial", 'x' : xcoord(i), 'y': ycoord(i) , 'path': null, 'flag': false, 'counter': Infinity});
      }

      _store.grid = newCells;

      GridsterStore.emit(CHANGE_EVENT);
    break;

    case GridsterConstants.GENERATE_CLICK:

      let clickIndex = _store.grid.findIndex((obj => obj.id === parseInt(action.value, 10)));

      if(_store.grid[clickIndex].clicked === "false" && clickIndex !== _store.start.id && clickIndex !== _store.end.id) {
        _store.grid[clickIndex].clicked = "true";
      } else if(_store.grid[clickIndex].clicked === "true" && clickIndex !== _store.start.id && clickIndex !== _store.end.id) {
          _store.grid[clickIndex].clicked = "false";
          // 
      }

      // on click check for connection
      let unVisited = _store.grid.filter((obj => (obj.clicked === "true") ));

      let end = _store.grid.filter((obj => (obj.clicked === "end") ));

      let start = _store.grid.filter((obj => (obj.clicked === "start") ));

      isEndVisited(unVisited, end, start);

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

    case GridsterConstants.GENERATE_START:

      let startRow = parseInt(Math.random()*_store.rows, 10);
      let startCell = startRow * _store.columns;
      _store.start = {'id': startCell, 'x': xcoord(startCell), 'y': ycoord(startCell)};

      let startIndex = _store.grid.findIndex((obj => obj.id === parseInt(startCell, 10)));

      _store.grid[startIndex].clicked = "start";

      GridsterStore.emit(CHANGE_EVENT);
    break;

    case GridsterConstants.GENERATE_END:

      let endRow = parseInt(Math.random()*_store.rows, 10);
      let endCell = endRow * _store.columns + (_store.columns -1);
      _store.end = {'id': endCell, 'x': xcoord(endCell), 'y': ycoord(endCell)};

      let endIndex = _store.grid.findIndex((obj => obj.id === parseInt(endCell, 10)));
      _store.grid[endIndex].clicked = "end";
      _store.grid[endIndex].counter = 0;

      GridsterStore.emit(CHANGE_EVENT);
    break;

    default:

      return true;
  }

});

export default GridsterStore;

