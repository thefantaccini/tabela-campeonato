import React, { useState, useEffect, Fragment } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {

    const [configs, setConfigs] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [times, setTimes] = useState([]);

    async function getData() {
        let response = await fetch("http://localhost:3000/data/data.json")
        let data = await response.json()
        return data
    }

    useEffect(() => {
        getData().then(data => {
            setConfigs(data["configs"])
            setGrupos(data["grupos"])
            setTimes(data["times"])
        })
    }, []) //Ocorre apenas na inicialização


  return null
}

export default App;
