import React, { Component } from 'react';
// import GridsterStore from '../stores/GridsterStore.js';
import GridItem from './GridItem';
import PropTypes from 'prop-types';

const ulStyle = {
	display: 'inline-block',
	float: 'left',
	width: '100%',
	listStyleType: 'none',
	padding: 0,
	margin: 0
}

export default class Grid extends Component {

  render() {

   let rows = [];
    if (this.props.grid) {
      this.props.grid.map((item, index) => {
        return rows.push(
  			<GridItem key={index} id={index}/>
  			);
      });
    }

    return (
    <ul style={ulStyle}>
    	{rows}
    </ul>
    );
  }

}

Grid.propTypes = {
  grid: PropTypes.array
  //key special prop
};
