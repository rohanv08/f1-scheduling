import config from './config.json'
require("babel-polyfill");

export async function queryBackend(route, params={}) {
    params = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined));
    const res = await fetch(`http://${config.server_host}:${config.server_port}/${route}?` + new URLSearchParams(params));
    if (res.status === 200) return res.json();
    if (res.status === 400) throw await res.text();
    console.warn("server returned " + res.status + ": " + await res.text());
}

    const getTournamentMatchings = async (eventID, siteID) => {
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
    getTournamentMatchings
}
