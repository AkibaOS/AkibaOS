import BootScreen from './components/Bootscreen'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <BootScreen></BootScreen>
    </>
  )
}

export default App
