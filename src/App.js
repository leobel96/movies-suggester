import React, { useState } from 'react'
import styled from 'styled-components'
import './App.css'
import Grid from './Grid'
import Home from './Home'
import Logo from './logo'

const Button = styled.button`
  background-color: #424242;
  border-radius: 0.5rem;
`

function App () {
  const [view, setView] = useState('home')
  const [type, setType] = useState(null)

  let toShow

  const changeType = (newType) => {
    setType(newType)
    setView('grid')
  }

  if (view === 'home') {
    toShow = <Home changeType={changeType} />
  } else if (view === 'grid') {
    toShow = <Grid type={type} backToHome={() => setView('home')}/>
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='w-full grid h-32 items-center justify-items-start grid-cols-3 grid-rows-1'>
          {view === 'grid'
            ? <Button onClick={() => setView('home')} className='px-7 py-4 m-auto sm:ml-12 text-xl sm:text-lg'>
                🏠
                <p className='hidden sm:inline'> Home</p>
              </Button>
            : <div/>
          }
          <Logo className='h-full m-auto w-3/4' />
        </div>
        {toShow}
      </header>
    </div>
  )
}

export default App
