import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Header } from './components/Header'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <TaskForm></TaskForm>
      <TaskList></TaskList>

    </>
  )
}

export default App
