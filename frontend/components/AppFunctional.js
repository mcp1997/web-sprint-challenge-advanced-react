import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setIndex(initialIndex)
  }

  function getXY(currentIndex) {
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

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let coordinates = getXY(index)
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
    else return index
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const newIndex = getNextIndex(evt.target.id)
    const newMessage = newIndex === index ? `You can't go ${evt.target.id}` : ''
    const newSteps = newIndex === index ? steps : steps + 1
    
    setIndex(newIndex)
    setMessage(newMessage)
    setSteps(newSteps)
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    const coordinates = getXY(index)
    axios.post('http://localhost:9000/api/result', { x: coordinates.x, y: coordinates.y, steps: steps, email: email })
      .then(res => {
        setMessage(res.data.message)
        setEmail(initialEmail)
      })
      .catch(err => {
        setMessage(err.response.data.message)
        setEmail(initialEmail)
      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 data-testid="coordinates" id="coordinates">{getXY(index).position}</h3>
        <h3 data-testid="steps" id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 data-testid="message" id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} data-testid="left" id="left">LEFT</button>
        <button onClick={move} data-testid="up" id="up">UP</button>
        <button onClick={move} data-testid="right" id="right">RIGHT</button>
        <button onClick={move} data-testid="down" id="down">DOWN</button>
        <button onClick={reset} data-testid="reset" id="reset">reset</button>
      </div>
      <form>
        <input onChange={onChange} id="email" type="email" placeholder="type email" value={email}></input>
        <input onClick={onSubmit} data-testid="submit" id="submit" type="submit"></input>
      </form>
    </div>
  )
}
