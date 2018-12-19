import React from 'react';
import PropTypes from 'prop-types';
import './Square.css';

const Square = (props) => {
  const color = getColor(props.value)
    return (
      <div className='square' style={{
            marginLeft: props.col*100,
            marginTop:props.row*100,
            backgroundColor: color,
          }}>
        <span className='value'>{props.value}</span>
      </div>
    )
  }

Square.propTypes = {
  value: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
};

function getColor(value) {
  const numbers = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
  const colors = ['#009900', '#666633', '#cc6600', '#cc6699', '#9999ff', '#0099cc', '#800000', '#ffffcc',  '#0066ff', '#ffffff', '#33cc33','#000'];
  const index = numbers.indexOf(value);

  return colors[index];
}

export default Square;
