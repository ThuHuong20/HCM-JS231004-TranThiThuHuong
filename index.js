"use strict";
class Player {
    constructor(name, id = Date.now() * Math.random(), point = 0) {
        this.name = name;
        this.point = point;
        this.id = id;
    }
}
class PlayerManager {
    constructor() {
        var _a;
        this.players = [];
        let playerLocal = JSON.parse((_a = (localStorage.getItem("players"))) !== null && _a !== void 0 ? _a : "[]");
        let playerTemp = [];
        for (let i in playerLocal) {
            playerTemp.push(new Player(playerLocal[i].name, playerLocal[i].id, playerLocal[i].point));
        }
        this.players = playerTemp;
        this.render();
        this.caculateTotalPoints();
        this.caculateTotalPlayers();
    }
    createPlayer(newPlayer) {
        this.players.push(newPlayer);
        this.render();
        this.caculateTotalPoints();
        this.caculateTotalPlayers();
        localStorage.setItem("players", JSON.stringify(this.players));
    }
    deletePlayer(id) {
        this.players = this.players.filter(player => player.id != id);
        localStorage.setItem('players', JSON.stringify([...this.players]));
        this.render();
    }
    increasePoint(id) {
        this.players = this.players.map((player) => {
            if (player.id === id) {
                player.point += 1;
            }
            return player;
        });
        this.caculateTotalPoints();
        this.render();
        localStorage.setItem("players", JSON.stringify(this.players));
    }
    decreasePoint(id) {
        this.players = this.players.map((player) => {
            if (player.id === id) {
                if (player.point > 0) {
                    player.point -= 1;
                }
            }
            return player;
        });
        this.caculateTotalPoints();
        this.render();
        localStorage.setItem("players", JSON.stringify(this.players));
    }
    caculateTotalPoints() {
        const totalPointsElement = document.getElementById("total-points");
        let totalPoints = this.players.reduce((total, player) => {
            return total + player.point;
        }, 0);
        totalPointsElement.innerText = totalPoints.toString();
        localStorage.setItem("players", JSON.stringify(this.players));
        return totalPoints;
    }
    caculateTotalPlayers() {
        const totalPlayersElement = document.getElementById("total-players");
        totalPlayersElement.innerHTML = this.players.length.toString();
        localStorage.setItem("players", JSON.stringify(this.players));
    }
    getHighestScorer() {
        if (this.players.length === 0) {
            return null;
        }
        let highestScorer = this.players[0];
        for (const player of this.players) {
            if (player.point > highestScorer.point) {
                highestScorer = player;
            }
        }
        return highestScorer;
    }
    // findMaxPointPlayers(): number[] {
    //     let maxPointPlayers: number[] = [];
    //     let maxPoint = 0;
    //     for (const player of this.players) {
    //         if (player.point > maxPoint) {
    //             maxPoint = player.point;
    //             maxPointPlayers = [player.id];
    //         } else if (player.point === maxPoint) {
    //             maxPointPlayers.push(player.id);
    //         }
    //     }
    //     return maxPointPlayers;
    // }
    render() {
        let renderEl = document.getElementById("content_user");
        let trString = ``;
        const highestScorer = this.getHighestScorer();
        // const maxPointPlayerIds = this.findMaxPointPlayers();
        this.players.map((player) => {
            // const isMaxPointPlayer = maxPointPlayerIds.includes(player.id);
            //console.log(isMaxPointPlayer);
            trString += `
            <div class="content_user_title">
               <div class="content_user_name">
                    <p onclick="handleDelete(${player.id})">X</p>
                    <i class="fa-solid fa-crown ${player === highestScorer ? 'bright-crown' : ''}"></i>
                    <p>${player.name}</p>
                </div>
                <div class="content_user_point">
                    <button onclick="handleDecreasePoint(${player.id})">-</button>
                    <p>${player.point}</p>
                    <button onclick=" handleIncreasePoint(${player.id})">+</button>
                </div>
            </div>
            `;
        });
        renderEl.innerHTML = trString;
    }
}
const players = new PlayerManager();
function addPlayer() {
    let playerValue = document.getElementById("player").value;
    let newPlayer = new Player(playerValue);
    players.createPlayer(newPlayer);
    document.getElementById("player").value = "";
}
function handleDelete(id) {
    players.deletePlayer(id);
    players.caculateTotalPlayers();
    players.caculateTotalPoints();
    players.render();
}
function handleIncreasePoint(id) {
    players.increasePoint(id);
}
function handleDecreasePoint(id) {
    players.decreasePoint(id);
}
