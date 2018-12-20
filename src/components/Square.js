import React from 'react';
import PropTypes from 'prop-types';
import './Square.css';

const Square = ({ col, row, coords, value }) => {
  const color = getColor(value);
  const fontColor = getFontColor(value);
    return (
      <div className={`square ${row === +coords[0] && col === +coords[1] ? 'new': ''}`} style={{
            marginLeft: col*100,
            marginTop: row*100,
            backgroundColor: color,
            color: fontColor,
          }}>
        <span className='value'>{value}</span>
      </div>
    )
  }

Square.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
};

function getColor(value) {
  const numbers = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384];
  const colors = ['#eee', '#eec', '#fb8','#f96','#f75','#f53','#ec7','#ec6','#ec5','#ec3','#ec2','#000','#000','#000','#000','#000'];
  const index = numbers.indexOf(value);

  return colors[index];
}

function getFontColor(value){
  const numbers = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384];
  const fontColors = ['#222', '#222', '#eee','#eee','#eee','#eee','#222','#222','#222','#222','#eee','#eee','#eee','#eee',];
  const index = numbers.indexOf(value);

  return fontColors[index];
}

export default Square;
