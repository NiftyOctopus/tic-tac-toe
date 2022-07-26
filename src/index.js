import React    from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'


function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    )
}


class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>
    }

    render() {
        return (
            <div>
                <div className='board-row'>
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                
                <div className='board-row'>
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>

                <div className='board-row'>
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            history: [{ squares: Array(9).fill(null), i: null }],
            xIsNext: true, move: 0
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.move + 1)
        const current = history[this.state.move]
        const squares = current.squares.slice()

        const winner  = calculateWinner(squares)
        if(winner || squares[i]) return

        squares[i] = this.state.xIsNext ? 'X' : 'O'

        this.setState({
            history: history.concat([{ squares: squares, i }]),
            xIsNext: !this.state.xIsNext,
            move:    history.length
        })
    }

    jumpTo(move) {
        console.log('Jumping to ' + move)
        this.setState({ move, xIsNext: (move % 2) === 0 })
    }

    getCoords(snapshot) {
        const col = (snapshot.i % 3) + 1
        const row = Math.floor(snapshot.i / 3) + 1
        return '(' + col + ', ' + row + ')'
    }

    render() {
        const history = this.state.history
        const current = history[this.state.move]
        const winner  = calculateWinner(current.squares)
        let status


        if(winner) {
            status = 'Winner: ' + winner
        } else {
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O')
        }

        const moves = history.map((snapshot, i) => {
            const who = snapshot.squares[snapshot.i]
            const msg = i ? 'Go to move ' + i + ' at ' + this.getCoords(snapshot) + ' by ' + who : 'Go to game start'

            return (
                <li key={i}>
                    <button
                        onClick={() => this.jumpTo(i)}
                        style={{ fontWeight: this.state.move === i ? 'bold' : 'normal' }}
                    >{msg}</button>
                </li>
            )
        })

        return (
            <div className='game'>
                <div className='game-board'>
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                </div>

                <div className='game-info'>
                    <div>Current Move: {this.state.move}</div>
                    <div>{status}</div>
                    <ul>{moves}</ul>
                </div>
            </div>
        )
    }
}
  
  
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Game/>)


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    for(let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }

    return null
  }