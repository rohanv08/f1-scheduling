import config from './config.json'
require("babel-polyfill");

export async function queryBackend(route, params={}) {
    params = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined));
    const res = await fetch(`http://${config.server_host}:${config.server_port}/${route}?` + new URLSearchParams(params));
    if (res.status === 200) return res.json();
    if (res.status === 400) throw await res.text();
    console.warn("server returned " + res.status + ": " + await res.text());
}

const getAllPlayers = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/players?result_pos=${page}&result_size=${pagesize}`, {
        method: 'GET',
    })
    if (res.status === 200) {
    return res.json()
    } else if (res.status === 400) {
        return null
    }
}

const getSortedPlayers = async (page, pagesize, sort_by, order) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/players?result_pos=${page}&result_size=${pagesize}&sort_by=${sort_by}&order=${order}`, {
        method: 'GET',
    })
    if (res.status === 200) {
    return res.json()
    } else if (res.status === 400) {
        return null
    }
}

const getPlayer = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/${id}/stats`, {
        method: 'GET',
    })
    if (res.status === 200) {
        return res.json()
        } else if (res.status === 400) {
            return null
        }
    }

const getPlayerMatches = async (id, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/${id}/matches?result_pos=${page}&result_size=${pagesize}`, {
        method: 'GET',
    })
    if (res.status === 200) {
        return res.json()
        } else if (res.status === 400) {
            return null
        }
    }

    const getAllTournaments = async (page, pagesize, city, eventID, min, max, before, after) => {
        if (min == null) {
            min = 0;
        }
        if (max == null) {
            max = 10000;
        }
        if (before == null) {
            before = "2100-01-01"
        }
        if (after == null) {
            after = "1900-01-01"
        }
        var res = await fetch(`http://${config.server_host}:${config.server_port}/tournaments?result_pos=${page}&result_size=${pagesize}&city_name=${city}&event_name=${eventID}&min_rating=${min}&max_rating=${max}&before=${before}&after=${after}`, {
            method: 'GET',
        })
        if (res.status === 200) {
        return res.json()
        } else if (res.status === 400) {
            return null
        }
    }

    const getTournamentStandings = async (eventID, siteID) => {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/tournaments/${eventID}/${siteID}/standings`, {
            method: 'GET',
        })
        if (res.status === 200) {
        return res.json()
        } else if (res.status === 400) {
            return null
        }
    }


export {
    getAllPlayers,
    getSortedPlayers,
    getPlayer,
    getPlayerMatches,
    getAllTournaments,
    getTournamentStandings
}
