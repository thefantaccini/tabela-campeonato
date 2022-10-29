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
        let newValue = e.currentTarget.value
        if (newValue < 0) newValue = 0
        let newConfig = JSON.parse(JSON.stringify(configs))
        if (config == "numDeTimes") {
            newConfig.numDeTimes = newValue
            if (newConfig.numDeTimes > configs.numDeTimes) criarTime()
            else removerTime()
        }
        if (config == "numDeGrupos") {
            newConfig.numDeGrupos = newValue
        }
        if (config == "classificadosPorGrupo") {
            newConfig.classificadosPorGrupo = newValue
        }
        setConfigs(newConfig)
        //console.log(configs.numDeTimes)
    }

    function criarTime() {
        let novosTimes = JSON.parse(JSON.stringify(times))
        novosTimes.push({
            "id": times.length,
            "nome": "Time" + (times.length + 1),
            "grupo": 0,
            "pontos": 0,
            "vitorias": 0,
            "empates": 0,
            "derrotas": 0,
            "gols-pro": 0,
            "saldo": 0
        })
        setTimes(novosTimes)
    }

    function removerTime() {
        let novosTimes = JSON.parse(JSON.stringify(times))
        novosTimes.pop()
        setTimes(novosTimes)
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
    function ConfigurarTimes(props) {
        console.log(times)
        return (
            times.map(t =>
                <input type='text' value={t.nome} key={t.id} />
                )
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
        <React.Fragment>
            <ConfigurarTabela />
            <br/>
            <ConfigurarTimes />
        </React.Fragment>
      )
}

export default App;
