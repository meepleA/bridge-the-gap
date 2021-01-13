const playerStorageKey = "playerStorageKey";

export async function initialisePlayerStorageKey() {
    if (localStorage.getItem(playerStorageKey) !== null) {
        return; // playerId is already set
    }

    // fetch id and set local storage variable
    const resp = await (fetch("/getPlayerID", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ test: "give ID" })
    })
        .then(response => response.json())
        .then(readable => { localStorage.setItem(playerStorageKey, readable); })
        .catch(function (error) {
            console.log(error);
        }));
    }

