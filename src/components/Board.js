import React, { Component } from 'react';
import Square from './Square';
import './Board.css';

class Board extends Component {
  constructor(props){
    super(props);
    this.state = {
      squares: [],
      win: false,
      lose: false,
      continued: false,
    };
    this.divRef = React.createRef();
  }

  componentDidMount(){
    this.divRef.current.focus();
    this.getInitialState();
  }

  componentDidUpdate(){
    const { squares, lose, win } = this.state
    if (!win) {
      this.winner(squares);
    }
    if (!lose) {
      this.loser(squares);
    }
  }

  handleKeyPress = (event) => {
    const { squares } = this.state;
    let newSquares = squares.slice();

    if (event.keyCode === 37) {
      for (let i = 0, max = squares.length; i < max; i+=1) {
          const row = this.fillNullLeft(this.toLeft(squares[i]), max);
          newSquares[i] = row;
      }
    }

    if (event.keyCode === 39) {
      for (let i = 0, max = squares.length; i < max; i+=1) {
          const row = this.fillNullRight(this.toRight(squares[i]), max);
          newSquares[i] = row;
        }
    }

    if (event.keyCode === 38) {
      let rotatedSquares = this.rotateArray(squares);
      for (let i = 0, max = rotatedSquares.length; i < max; i+=1) {
        const row = this.fillNullLeft(this.toLeft(rotatedSquares[i]), max);
        rotatedSquares[i] = row;
      }
      rotatedSquares = this.rotateArray(rotatedSquares);
      newSquares = rotatedSquares;
    }

    if (event.keyCode === 40) {
      let rotatedSquares = this.rotateArray(squares);
      for (let i = 0, max = rotatedSquares.length; i < max; i+=1) {
        const row = this.fillNullRight(this.toRight(rotatedSquares[i]), max);
        rotatedSquares[i] = row;
      }
      rotatedSquares = this.rotateArray(rotatedSquares);
      newSquares = rotatedSquares;
    }

    if (!this.compareArrays(squares, newSquares)) {
      this.setState((state) => ({
        squares: newSquares
      }), this.getRandomSquare(newSquares))
    }
  }

  toLeft = (row) => {
    const values = row.filter(item => item !== null);
    if (values.length > 1) {
      for (let i = 0; i < values.length; i+=1) {
        if (values[i] === values[i+1]) {
          values[i] = values[i] * 2;
          values.splice(i+1,1);
          break;
        }
      }
    }
    return values;
  }

  toRight = (row) => {
    const values = row.filter(item => item !== null);
    if (values.length > 1) {
      for (let i = values.length-1; i >= 0; i-=1) {
        if (values[i] === values[i-1]) {
          values[i] = values[i] * 2;
          values.splice(i-1,1);
          break;
        }
      }
    }
    return values;
  }

  fillNullLeft = (array, length) => {
    for (let i = 0; i < length; i+=1) {
      if (!array[i]) {
        array.push(null);
      }
    }
    return array;
  }

  fillNullRight = (array, length) => {
    for (let i = 0; i < length; i+=1) {
      if (!array[i]) {
        array.unshift(null);
      }
    }
    return array;
  }

  rotateArray = (array) => {
    let rotatedArray = [];
    for (let i = 0, max = array.length; i < max; i+=1) {
      rotatedArray[i] = [];
      for (let j = 0; j < max; j+=1) {
        rotatedArray[i][j] = array[j][i];
      }
    }
    return rotatedArray;
  }

  getRandomSquare = (squares) => {
    let newSquares = squares.slice();
    const newValue = [2,4,2,2][Math.floor(Math.random() * 4)];
    const randomSquare = this.getRandomCoords(squares);
    const coords = randomSquare.split('');
    newSquares[+coords[0]][+coords[1]] = newValue;
    this.setState({
      squares: newSquares
    })

  }

  getRandomCoords = (array) => {
    let nullArray = [];
    for (let i = 0, max = array.length; i < max; i+=1) {
      for (let j = 0; j < max; j+=1) {
        if (!array[i][j]) {
          nullArray.push(`${i}${j}`);
        }
      }
    }
    return nullArray[Math.floor(Math.random() * nullArray.length)];
  }

  compareArrays = (a1, a2) => {
    return (!(a1 > a2 || a1 < a2));
  }

  winner = (array) => {
    const { win } = this.state;
    if (!win) {
      for (let i = 0, max = array.length; i < max; i+=1) {
        for (let j = 0; j < max; j+=1) {
          if (array[i][j] === 2048) {
            this.setState({
              win: true,
            })
          }
        }
      }
    }
  }

  loser = (array) => {
    let countNull = 0;
    for (let i = 0, max = array.length; i < max; i+=1) {
      for (let j = 0; j < max; j+=1) {
        if (!array[i][j]) {
          countNull += 1;
        }
      }
    }
    if (countNull) return;
      for (let i = 0, max = array.length; i < max; i+=1) {
        for (let j = 0; j < max; j+=1) {
          if (array[i][j] === array[i][j+1]) return;
          if (i < 3 && array[i][j] === array[i+1][j]) return;
        }
      }
      this.setState({
        lose: true,
      })
  }

  getInitialState = (res) => {
    res = res || 4;
    let initialArray = [];
    for (let i = 0; i < res; i+=1) {
      initialArray[i] = [];
      for (let j = 0; j < res; j+=1) {
        initialArray[i][j] = null;
      }
    }
    let square1 = this.getRandomCoords(initialArray);
    let square2 = this.getRandomCoords(initialArray);

    if (square1 === square2) {
      this.setState({
        win: false,
        lose: false,
        continued: false,
        squares: [[null,null,null,null],[null,2,null,null],[null,null,null,2],[null,null,null,null]]
      });
      return;
    }
    const coordsOne = square1.split('');
    const coordsTwo = square2.split('');
    initialArray[+coordsOne[0]][+coordsOne[1]] = 2;
    initialArray[+coordsTwo[0]][+coordsTwo[1]] = 2;

    this.setState({
      win: false,
      lose: false,
      continued: false,
      squares: initialArray
    });
    this.divRef.current.focus();
  }

  renderBoard = () => {
    const { squares, win, lose, continued } = this.state;
    return (
      <div
        className='board'
        onKeyDown={this.handleKeyPress}
        tabIndex="0"
        ref={this.divRef}
        >
        {
          squares.map((squareRow, row) => {
            return squareRow.map((square, col) => {
              if (square) {
                return (
                  <Square
                    key={col}
                    row={row}
                    col={col}
                    value={square}
                    />
                );
              }
              return null;
            })
          })
        }
        {
          win && !continued && (
            <div className='modal'>
              <div className='modal_center'>
                <h2 className='h'>Вы победили!</h2>
                <button
                  className='btn'
                  onClick={() => this.getInitialState()}
                >
                  С начала
                </button>
                <button
                  className='btn'
                  onClick={() => {
                      this.setState((state) => ({continued: true}));
                      this.divRef.current.focus();
                    }
                  }
                >
                  Продолжить
                </button>
              </div>
            </div>
          )
        }
        {
          lose && (
            <div className='modal'>
              <div className='modal_center'>
                <h2 className='h'>Вы проиграли!</h2>
                <button
                  className='btn'
                  onClick={() => {
                      this.getInitialState();
                    }
                  }
                >
                  С начала
                </button>
              </div>
            </div>
          )
        }
      </div>
    )
  }

  render(){
      return this.renderBoard();
  }
}

export default Board;
