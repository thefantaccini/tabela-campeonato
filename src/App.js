import React, { useState, useEffect, useRef, Fragment } from 'react'
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

    useEffect(() => {
        montaGruposNosTimes()
    }, [configs])

    /*Para efeito de teste*/
    useEffect(() => {
        console.clear()
        console.log("---- Times ----")
        console.log(times)
    
    })

    function setNewConfigs(e, config) {
        let newValue = e.currentTarget.value
        if (newValue < 0) newValue = 0 // validação lógica
        let newConfig = JSON.parse(JSON.stringify(configs))
        if (config == "numDeTimes") {
            
            if (newValue > configs.numDeTimes) {
                criarTime()
                newConfig.numDeTimes = newValue
            }
            else {
                removerTime()
                newConfig.numDeTimes = newValue
            }
        }
        if (config == "numDeGrupos") {
            if (newValue < newConfig.numDeTimes + 1) newConfig.numDeGrupos = newValue
        }
        if (config == "classificadosPorGrupo") {
            newConfig.classificadosPorGrupo = newValue
        }
        setConfigs(newConfig)
    }

    function setNewTimes(id, e) {
        let newValue = e.currentTarget.value
        let newTimes = JSON.parse(JSON.stringify(times))
        newTimes[id].nome = newValue
        setTimes(newTimes)
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
    function montaGruposNosTimes() {
        const timesPorGrupo = Math.trunc(times.length / configs.numDeGrupos)

        console.clear()

        let posNoGrupo = 0
        let grupo = 0
        let newTimes = JSON.parse(JSON.stringify(times))
        newTimes.map(t => {
            t.grupo = grupo
            posNoGrupo++
            if (posNoGrupo == timesPorGrupo) {
                posNoGrupo = 0
                if (grupo < configs.numDeGrupos) grupo++
            }
        }
        )
        setTimes(newTimes)

    }
function Grupos() {

        
        
        return (
            <>

            </>
            )
        
    }
    function criaGrupo(qtdTimes, primeiroTime) {
        let ultimoInd = primeiroTime + qtdTimes
       

    }
    return (
        <React.Fragment>
            <ConfigurarTabela />
            <br/>
            {times.map(t =>
                <input type='text'
                    value={t.nome}
                    onChange={(e) => setNewTimes(t.id, e)}
                    key={t.id} />
            )}
            <Grupos/>
        </React.Fragment>
      )
}

export default App;
