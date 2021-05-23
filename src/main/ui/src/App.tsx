import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { NetworkService } from "./networkService";

const App = (): JSX.Element => {

  const [hello, setHello] = useState<string>("")

  useEffect(() => {
    getHello()
  }, [])

  const getHello = async (): Promise<void> => {
    const service = new NetworkService()
    const helloResponse = await service.getHello();
    setHello(helloResponse.data)
  }

  return <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo"/>
      <p>
        {hello}
      </p>
    </header>
  </div>
}

export default App
