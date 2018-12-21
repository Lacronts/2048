import React, { Component } from 'react';
import Square from './Square';
import './Board.css';
import {
  Header,
  Button,
} from 'semantic-ui-react';

class Board extends Component {
  constructor(props){
    super(props);
    this.state = {
      squares: [],
      prevSquares: [],
      win: false,
      lose: false,
      continued: false,
      score: 0,
      maxScore: 0,
      newCoords: [],
    };
    this.divRef = React.createRef();
  }

  componentDidMount(){
    this.divRef.current.focus();
    this.getInitialState();
    this.getMaxScore();
  }

  componentDidUpdate(){
    const { squares, lose, win, score, maxScore } = this.state
    if (!win) {
      this.winner(squares);
    }
    if (!lose) {
      this.loser(squares);
    }
    if (score > maxScore) {
      localStorage.setItem('maxScore', score);
      this.setState({
        maxScore: score,
      })
    }
  }

  getMaxScore = () => {
    const maxScore = localStorage.getItem('maxScore') || 0;

    this.setState({
      maxScore: maxScore,
    })
  }

  handleKeyPress = (event) => {
    const { squares } = this.state;

    let newSquares = squares.slice();
    const direction = event.keyCode - 37;
    const reverseDirection = direction === 0 ? 0 : 4 - direction;

    for (let dir = 0; dir < direction; dir+=1){
      newSquares = this.rotateArray(newSquares);
    }

    for (let i = 0, max = newSquares.length; i < max; i+=1) {
      const row = this.fillNullLeft(this.toLeft(newSquares[i]), max);
      newSquares[i] = row;
    }

    for (let dir = 0; dir < reverseDirection; dir+=1){
      newSquares = this.rotateArray(newSquares);
    }

    if (!this.compareArrays(squares, newSquares)) {
      this.setState((state) => ({
          squares: newSquares,
          prevSquares: squares,
        }), this.getRandomSquare);
    }
  }

  toLeft = (row) => {
    let sum = 0;
    const values = row.filter(item => item !== null);
    if (values.length > 1) {
      for (let i = 0; i < values.length; i+=1) {
        if (values[i] === values[i+1]) {
          values[i] = values[i] * 2;
          sum+=values[i];
          values.splice(i+1,1);
        }
      }
    }
    this.setState((state) => ({
      score: state.score + sum,
    }));
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

  rotateArray = (array) => {
    let rotatedArray = [];
    for (let i = 0, max = array.length; i < max; i+=1) {
      rotatedArray[i] = [];
      for (let j = 0; j < max; j+=1) {
        rotatedArray[i][j] = array[j][max - i - 1];
      }
    }
    return rotatedArray;
  }

  getRandomSquare = () => {
    const { squares } = this.state;
    let newSquares = squares.slice();
    const newValue = [2,4,2,2,2][Math.floor(Math.random() * 5)];
    const randomSquare = this.getRandomCoords(squares);
    const coords = randomSquare.split('');
    newSquares[+coords[0]][+coords[1]] = newValue;
    this.setState({
      squares: newSquares,
      newCoords: coords,
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
        score: 0,
        win: false,
        lose: false,
        continued: false,
        prevSquares: [],
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
      prevSquares: [],
      squares: initialArray,
      score: 0,
    });
    this.divRef.current.focus();
  }

  backToPrevState = () => {
    const { prevSquares } = this.state;

    this.setState({
      squares: prevSquares,
      prevSquares: [],
      lose: false,
    });
    this.divRef.current.focus();
  }

  renderBoard = () => {
    const { squares, win, lose, continued, score, maxScore, prevSquares, newCoords } = this.state;
    return (
      <React.Fragment>
      <div
        className='board'
        onKeyDown={this.handleKeyPress}
        tabIndex="0"
        ref={this.divRef}
        >
        {
          squares.map((squareRow, row) => {
            return squareRow.map((square, col) => {
                return (
                  <Square
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    value={square}
                    coords={newCoords}
                  />
                );

            })
          })
        }
        {
          win && !continued && (
            <div className='modal'>
              <div className='modal_center'>
                <Header as='h2' inverted>Вы победили!</Header>
                <Button.Group>
                <Button
                  inverted
                  color='orange'
                  onClick={() => this.getInitialState()}
                >
                  С начала
                </Button>
                <Button
                  inverted
                  color='olive'
                  onClick={() => {
                      this.setState((state) => ({continued: true}));
                      this.divRef.current.focus();
                    }
                  }
                >
                  Продолжить
                </Button>
                </Button.Group>
              </div>
            </div>
          )
        }
        {
          lose && (
            <div className='modal'>
              <div className='modal_center'>
                <Header as='h2' inverted>Вы проиграли!</Header>
                <Button
                  inverted
                  color='orange'
                  onClick={() => {
                      this.getInitialState();
                    }
                  }
                >
                  С начала
                </Button>
              </div>
            </div>
          )
        }
      </div>
      <div style={{textAlign: 'center', marginTop: '10px'}}>
        <Button
          onClick={this.backToPrevState}
          disabled={!prevSquares.length}
        >
          Шаг назад
        </Button>
        <Header color='orange' as='h2'>Your Score: {score}
        <Header.Subheader>Max Score: {maxScore}</Header.Subheader>
        </Header>
      </div>
    </React.Fragment>
    )
  }

  render(){
      return this.renderBoard();
  }
}

export default Board;
