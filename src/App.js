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

    function setNewConfigs(e, config) {
        const newValue = e.currentTarget.value
        if (newValue < 0) newValue = 0
        let newConfig = JSON.parse(JSON.stringify(configs))
        if (config == "numDeTimes") newConfig.numDeTimes = newValue
        if (config == "numDeGrupos") newConfig.numDeGrupos = newValue
        if (config == "classificadosPorGrupo") newConfig.classificadosPorGrupo = newValue
        setConfigs(newConfig)
        //console.log(configs.numDeTimes)
    }

    function ConfigurarTabela(props) {
        return (
            <React.Fragment>
                <label>Times: </label>
                <input type='number'
                value={configs.numDeTimes}
                    onChange={(e) => setNewConfigs(e,"numDeTimes")} />
                <label>Grupos: </label>
                <input type='number'
                    value={configs.numDeGrupos}
                    onChange={(e) => setNewConfigs(e,"numDeGrupos")} />
                <label>Classificados por Grupo: </label>
                <input type='number'
                    value={configs.classificadosPorGrupo}
                    onChange={(e) => setNewConfigs(e,"classificadosPorGrupo")} />
            </React.Fragment>
                )
    }

    useEffect(() => {
        getData().then(data => {
            setConfigs(data["configs"])
            setGrupos(data["grupos"])
            setTimes(data["times"])
        })
    }, []) //Ocorre apenas na inicialização


    return (
        <ConfigurarTabela/>
      )
}

export default App;
