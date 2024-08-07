import visualizeDijkstra from "./dijkstra.js"
import visualizeAStar from "./A_star.js"

const ratio = 2.5
const mazeCols = 50
const mazeRows = mazeCols / ratio
const grid = []
let isPressed = false
let isStarted = false
let dijDone = false
let astarDone = false
let startNode = []
let finishNode = []
let myStorage = window.sessionStorage
if(myStorage.getItem("algo") === null) myStorage.setItem("algo", "Dijkstra")
let algo = myStorage.getItem("algo")
document.querySelector("#select-algo").value = algo

main()

function main() {
    initializeGrid()
    handleMouseEvents()
    setupVisualizerBTN()
    setupResetBTN()
}

function initializeGrid() {
    for (let row = 0; row < mazeRows; row++) {
        const currentRow = []
        for (let col = 0; col < mazeCols; col++) {
            const currentNode = {
                row,
                col,
                id: row + "-" + col,
                isStart: false,
                isFinish: false,
                isVisited: {
                    dij: false,
                    astar: false
                },
                isWall: false,
                distance: Infinity,
                prevNode: {
                    dij: null,
                    astar: null
                }
            }
            currentRow.push(currentNode)
        }
        grid.push(currentRow)
    }

    for (let i = 0; i < mazeRows; i++) {
        for (let j = 0; j < mazeCols; j++) {
            let div = document.createElement("div")
            div.classList.add("node")
            div.id = i + "-" + j
            document.querySelector(".maze-container").appendChild(div)
        }
    }
}


function setupVisualizerBTN() {
    if((algo === "Dijkstra" && !dijDone) || (algo === "A Star" && !astarDone)) {
        document.querySelector("#start-visualization").addEventListener("click", startVis)
        document.querySelector("#start-visualization").classList.remove("disable-button")
        isStarted = false
    }
}

function startVis() {
    if (!Array.isArray(startNode) && !Array.isArray(finishNode)) {
        isStarted = true
        if(algo === "Dijkstra" && !dijDone) {
            visualizeDijkstra(grid, startNode, finishNode)
            dijDone = true
        }
        else if(algo === "A Star" && !astarDone) {
            visualizeAStar(grid, startNode, finishNode)
            astarDone = true
        }
        if((dijDone && astarDone) || (algo === "Dijkstra" && dijDone) || (algo === "A Star" && astarDone)) {
            document.querySelector("#start-visualization").removeEventListener("click", startVis)
            document.querySelector("#start-visualization").classList.add("disable-button")
            isStarted = true
        }
        else isStarted = false
    }
    else alert("ADD START AND END NODES")
}

function setupResetBTN() {
    document.querySelector("#refresh-page").addEventListener("click", () => {
        location.reload()
    })
}

document.querySelectorAll(".dropdown-element").forEach((element) => {
    element.addEventListener("click", e => {
        algo = e.target.innerText
        myStorage.setItem("algo", algo)
        document.querySelector("#select-algo").value = algo
        document.querySelector(".dropdown-content").classList.toggle("show")
        setupVisualizerBTN()
    })
})

document.querySelector("#select-algo").addEventListener("click", () => {
    document.querySelector(".dropdown-content").classList.toggle("show")
})


window.onclick = event => {
    if (event.target.id !== "select-algo") {
      let openDropdown = document.querySelector(".dropdown-content");
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
    }
  } 




function handleMouseEvents() {
    let counter = 0
    const nodes = document.querySelectorAll(".node")
    nodes.forEach(node => {
        const [row, col] = node.id.split("-").map(pos => parseInt(pos))
        node.addEventListener("mousedown", () => {
            if (isStarted) return
            if (counter > 1) {
                mouseDownEvent(row, col)
            } else {
                counter = addStartFinishNodes(row, col, counter)
            }

        })

        node.addEventListener("mouseenter", () => {
            mouseEnterEvent(row, col)
        })

        node.addEventListener("mouseup", () => {
            mouseUpEvent()
        })
    })

    document.querySelector(".maze-container").addEventListener("mouseleave", () => {
        isPressed = false
    })
}

function mouseDownEvent(row, col) {
    isPressed = true
    toggleWalls(row, col)
}

function mouseEnterEvent(row, col) {
    if (!isPressed) return
    toggleWalls(row, col)
}

function mouseUpEvent() {
    isPressed = false
}

function toggleWalls(row, col) {
    if (grid[row][col] === startNode || grid[row][col] === finishNode) return
    grid[row][col].isWall = !grid[row][col].isWall
    document.getElementById(grid[row][col].id).classList.toggle("wall")
}

function addStartFinishNodes(row, col, counter) {

    if (counter === 0) {
        grid[row][col].isStart = true
        startNode = grid[row][col]
        document.getElementById(grid[row][col].id).classList.add("start")
    }
    else if (counter === 1 && grid[row][col] !== startNode) {
        grid[row][col].isFinish = true
        finishNode = grid[row][col]
        document.getElementById(grid[row][col].id).classList.add("finish")
    }
    else return counter
    return ++counter
}