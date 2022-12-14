import React, { useState, useEffect, useRef, Fragment } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {

    const [configs, setConfigs] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [times, setTimes] = useState([]);
    const [partidas, setPartidas] = useState([]);

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
    }, []) //Ocorre apenas na inicializa??o

    useEffect(() => {
       defineGrupos()
    }, [configs])
    useEffect(() => {
        criaPartidasDoGrupo()
    }, [grupos])
    useEffect(() => {
        criaPartidasDoGrupo()
    }, [times])


    /*Para efeito de teste*/
    useEffect(() => {
        
        console.clear()
        console.log("---- Configs ----")
        console.log(configs)
        console.log("---- Times ----")
        console.log(times)
        console.log("---- Grupos ----")
        console.log(grupos)
        console.log("---- Partidas ----")
        console.log(partidas)
        
         
    })

    function setNewConfigs(e, config) {
        let newValue = e.currentTarget.value
        if (newValue < 0) newValue = 0 // valida??o l?gica
        let newConfig = JSON.parse(JSON.stringify(configs))
        if (config == "numDeTimes") {
            if (newValue > times.length) {
                criarTime()
                newConfig.numDeTimes = newValue
            }
            else {
                removerTime()
                newConfig.numDeTimes = newValue
            }
        }
        if (config == "numDeGrupos") {
            //if (newValue <= configs.numDeTimes)
                if (newValue > newConfig.numDeGrupos) {
                    criarGrupo()
                    newConfig.numDeGrupos = newValue
                }
                else {
                    removerGrupo()
                    newConfig.numDeGrupos = newValue
                }
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
        forcaAtualizao()
    }

    function forcaAtualizao() {
        let newConfigs = JSON.parse(JSON.stringify(configs))
        setConfigs(newConfigs)
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

    async function defineGrupos() {
        const timesPorGrupo = Math.trunc(times.length / configs.numDeGrupos)
        let posNoGrupo = 0
        let grupo = 0
        let newTimes = JSON.parse(JSON.stringify(times))
        let newGrupos = JSON.parse(JSON.stringify(grupos))
        let timesDesseGrupo = []
        newTimes.map(t => {
            t.grupo = grupo
            if (t.nome != null) timesDesseGrupo.push(t)
            posNoGrupo++
            if (newGrupos[grupo] != null) newGrupos[grupo].times = timesDesseGrupo
            if (posNoGrupo == timesPorGrupo) {
                posNoGrupo = 0
                if (grupo < configs.numDeGrupos - 1) {
                    timesDesseGrupo = []
                    grupo++
                }
            }
        }
        )
        await setTimes(newTimes)
        await setGrupos(newGrupos)
        
    }

    function Grupos() {
        return grupos.map(g => (
            <table>
                <td>
                    <tr>
                        <td>Grupo {g.id}</td>
                        <td>V</td>
                        <td>E</td>
                        <td>D</td>
                        <td>SG</td>
                    </tr>
                    {g.times.map(k => (
                        <tr>
                            <td>{k.nome}</td>
                            <td>{k.vitorias}</td>
                            <td>{k.empates}</td>
                            <td>{k.derrotas}</td>
                            <td>{k.saldo}</td>
                       </tr>
                    ))}
                </td>
            </table>
        ))
    }



    function criarGrupo() {
        let novosGrupos = JSON.parse(JSON.stringify(grupos))
        novosGrupos.push({
            "id": novosGrupos.length,
            "times" : []
        })
        setGrupos(novosGrupos)
    }

    function removerGrupo() {
        let novosGrupos = JSON.parse(JSON.stringify(grupos))
        novosGrupos.pop()
        setGrupos(novosGrupos)
    }


    function criaPartidasDoGrupo() {
        let novasPartidas = []
        grupos.map(g => {
            let id = 0
            //for (let k = 1; k < g.times.length; k++)
            for (let i = 0; i < g.times.length; i++) {
                    for (let j = i + 1; j < g.times.length; j++) {
                        let partida = {
                                "id": id,
                                "grupo": g.id,                            
                                "timeCasa": g.times[i],
                                "timeFora": g.times[j],
                                "GolsCasa": 0,
                                "GolsFora": 0,
                                "rodada": j
                            }
                        novasPartidas.push(partida)
                        setPartidas(novasPartidas)
                        id++
                    }
            }
        }
       )
    }

    function setGols(id, team, e) {
        let newValue = e.currentTarget.value
        let newPartidas = JSON.parse(JSON.stringify(partidas))
        if (team == "home") newPartidas[id].GolsCasa = newValue
        else newPartidas[id].GolsFora = newValue
        if (newPartidas[id].GolsFora > newPartidas[id].GolsFora)
        setPartidas(newPartidas)
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
            <Grupos />
            <br />
            {partidas.map(p =>
                <React.Fragment>
                    <label>{p.timeCasa.nome}</label>
                    <input type='number' value={p.GolsCasa} onChange={(e) => setGols(p.id, "home", e)}/>
                    <label>X</label>
                    <input type='number' value={p.GolsFora} onChange={(e) => setGols(p.id, "away", e)}/>
                    <label>{p.timeFora.nome}</label>
                    <br/>
                </React.Fragment>
            )}
        </React.Fragment>
      )
}

export default App;
