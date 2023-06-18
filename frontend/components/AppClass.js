import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor() {
    super()
    this.state = initialState
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState)
  }

  getXY = (currentIndex) => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    if (currentIndex === 0) return { x: 1, y: 1, position: `Coordinates (1, 1)`}
    else if (currentIndex === 1) return { x: 2, y: 1, position: `Coordinates (2, 1)`}
    else if (currentIndex === 2) return { x: 3, y: 1, position: `Coordinates (3, 1)`}
    else if (currentIndex === 3) return { x: 1, y: 2, position: `Coordinates (1, 2)`}
    else if (currentIndex === 4) return { x: 2, y: 2, position: `Coordinates (2, 2)`}
    else if (currentIndex === 5) return { x: 3, y: 2, position: `Coordinates (3, 2)`}
    else if (currentIndex === 6) return { x: 1, y: 3, position: `Coordinates (1, 3)`}
    else if (currentIndex === 7) return { x: 2, y: 3, position: `Coordinates (2, 3)`}
    else return { x: 3, y: 3, position: `Coordinates (3, 3)`}
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let coordinates = this.getXY(this.state.index)
    if(direction === 'up') {
      coordinates.y -= 1
    } else if(direction === 'down') {
      coordinates.y += 1
    } else if(direction === 'left') {
      coordinates.x -= 1
    } else coordinates.x += 1

    if(coordinates.x === 1 && coordinates.y === 1) return 0
    else if(coordinates.x === 2 && coordinates.y === 1) return 1
    else if(coordinates.x === 3 && coordinates.y === 1) return 2
    else if(coordinates.x === 1 && coordinates.y === 2) return 3
    else if(coordinates.x === 2 && coordinates.y === 2) return 4
    else if(coordinates.x === 3 && coordinates.y === 2) return 5
    else if(coordinates.x === 1 && coordinates.y === 3) return 6
    else if(coordinates.x === 2 && coordinates.y === 3) return 7
    else if(coordinates.x === 3 && coordinates.y === 3) return 8
    else return this.state.index
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const newIndex = this.getNextIndex(evt.target.id)
    const newMessage = newIndex === this.state.index ? `You can't go ${evt.target.id}` : ''
    const newSteps = newIndex === this.state.index ? this.state.steps : this.state.steps + 1
    
    this.setState({
      ...this.state,
      message: newMessage,
      index: newIndex,
      steps: newSteps
    })
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({
      ...this.state,
      email: evt.target.value
    })
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    const coordinates = this.getXY(this.state.index)
    axios.post('http://localhost:9000/api/result', { x: coordinates.x, y: coordinates.y, steps: this.state.steps, email: this.state.email })
      .then(res => {
        this.setState({
          ...this.state,
          message: res.data.message,
          email: ''
        })
      })
      .catch(err => {
        this.setState({
          ...this.state,
          message: err.response.data.message,
          email: ''
        })
      })
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXY(this.state.index).position}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={e => this.move(e)}>LEFT</button>
          <button id="up" onClick={e => this.move(e)}>UP</button>
          <button id="right" onClick={e => this.move(e)}>RIGHT</button>
          <button id="down" onClick={e => this.move(e)}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={e => this.onChange(e)}></input>
          <input id="submit" type="submit" onClick={e => this.onSubmit(e)}></input>
        </form>
      </div>
    )
  }
}
