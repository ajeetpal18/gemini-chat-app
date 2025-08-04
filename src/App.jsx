import { useState } from 'react'
import Gemini from './Gemini'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Gemini />
    </>
  )
}

export default App
