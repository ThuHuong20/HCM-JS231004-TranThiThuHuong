
class Player {
    id: number;
    name: string;
    point: number;
    constructor(name: string, id: number = Date.now() * Math.random(), point: number = 0) {
        this.name = name;
        this.point = point;
        this.id = id
    }
}

class PlayerManager {
    players: Player[] = [];
    constructor() {
        let playerLocal = JSON.parse((localStorage.getItem("players")) ?? "[]");
        let playerTemp = []
        for (let i in playerLocal) {
            playerTemp.push(new Player(playerLocal[i].name, playerLocal[i].id, playerLocal[i].point))
        }
        this.players = playerTemp;
        this.render()
        this.caculateTotalPoints();
        this.caculateTotalPlayers();
    }
    createPlayer(newPlayer: Player) {
        this.players.push(newPlayer);
        this.render()
        this.caculateTotalPoints();
        this.caculateTotalPlayers();
        localStorage.setItem("players", JSON.stringify(this.players))
    }
    deletePlayer(id: number) {
        this.players = this.players.filter(player => player.id != id);
        localStorage.setItem('players', JSON.stringify([...this.players]))
        this.render();
    }
    increasePoint(id: number) {
        this.players = this.players.map((player) => {
            if (player.id === id) {
                player.point += 1;
            }
            return player;
        });
        this.caculateTotalPoints()
        this.render();
        localStorage.setItem("players", JSON.stringify(this.players));
    }
    decreasePoint(id: number) {
        this.players = this.players.map((player) => {
            if (player.id === id) {
                if (player.point > 0) {
                    player.point -= 1;
                }
            }
            return player;
        });
        this.caculateTotalPoints()
        this.render();
        localStorage.setItem("players", JSON.stringify(this.players));

    }
    caculateTotalPoints(): number {
        const totalPointsElement = document.getElementById("total-points") as HTMLElement;
        let totalPoints = this.players.reduce((total, player) => {
            return total + player.point
        }, 0)
        totalPointsElement.innerText = totalPoints.toString()
        localStorage.setItem("players", JSON.stringify(this.players));
        return totalPoints;
    }

    caculateTotalPlayers() {
        const totalPlayersElement = document.getElementById("total-players") as HTMLElement;
        totalPlayersElement.innerHTML = this.players.length.toString()
        localStorage.setItem("players", JSON.stringify(this.players));
    }
    getHighestScorer(): Player | null {
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
        let renderEl = document.getElementById("content_user") as HTMLElement;
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
            `
        })
        renderEl.innerHTML = trString
    }
}
const players = new PlayerManager();
function addPlayer() {
    let playerValue = (document.getElementById("player") as HTMLInputElement).value;
    let newPlayer = new Player(playerValue);
    players.createPlayer(newPlayer);
    (document.getElementById("player") as HTMLInputElement).value = "";
}

function handleDelete(id: number): void {
    players.deletePlayer(id)
    players.caculateTotalPlayers()
    players.caculateTotalPoints()
    players.render()
}
function handleIncreasePoint(id: number) {
    players.increasePoint(id);
}

function handleDecreasePoint(id: number) {
    players.decreasePoint(id);

}

