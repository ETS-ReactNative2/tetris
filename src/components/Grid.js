import React, { Component } from 'react';
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
    console.log('GRID here');
    console.log('this.props', this.props);

   let rows = [];
    if ((this.props.rows * this.props.columns) > 0) {
        console.log('this.props.rows * this.props.columns', this.props.rows * this.props.columns);
        console.log('this.props.grid', this.props.grid);

      this.props.grid.map((item, index) => {
        console.log('this.props.grid[item]', this.props.grid[index]);
        return rows.push(
  			<GridItem key={index} id={index} text={this.props.grid[index]}/>
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
