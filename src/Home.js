import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import './App.css'

const Button = styled.button`
  height: 65%;
  width: min-content;
  white-space: nowrap;
  padding: 1rem;
  background-color: #424242;
  border-radius: 0.5rem;
  margin: 1rem;
`

function Home (props) {
  return (
    <div className='m-auto flex flex-col items-center'>
      <Button onClick={() => props.changeType('movies')}>
        Movies
      </Button>
      <p className='italic'>Or</p>
      <Button onClick={() => props.changeType('shows')}>
        TV Series
      </Button>
    </div>
  )
}

Home.propTypes = {
  changeType: PropTypes.func
}

export default Home
