import { useState } from 'react'
import BootScreen from './components/Bootscreen'
import LoginScreen from './components/Loginscreen'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [isBooting, setIsBooting] = useState(true)

  const handleBootComplete = (): void => {
    setIsBooting(false)
  }

  return <>{isBooting ? <BootScreen onBootComplete={handleBootComplete} /> : <LoginScreen />}</>
}

export default App
