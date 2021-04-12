
const mazeSize = 30
const grid = []
let isPressed = false
let isStarted = false
let startNode = []
let finishNode = []

main()

function main() {
    initializeGrid()
    handleMouseEvents()
    setupVisualizerBTN()
    setupResetBTN()
}

function initializeGrid() {

    for (let row = 0; row < mazeSize; row++) {
        const currentRow = []
        for (let col = 0; col < mazeSize; col++) {
            const currentNode = {
                row,
                col,
                id: row + "-" + col,
                isStart: false,
                isFinish: false,
                isVisited: false,
                isWall: false,
                distance: Infinity,
                prevNode: null
            }
            currentRow.push(currentNode)
        }
        grid.push(currentRow)
    }

    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            let div = document.createElement("div")
            div.classList.add("node")
            div.id = i + "-" + j
            document.querySelector(".maze-container").appendChild(div)
        }
    }
}


function setupVisualizerBTN() {
    document.querySelector("#start-visualization").addEventListener("click", startVis)
}

function startVis() {
    if (!Array.isArray(startNode) && !Array.isArray(finishNode)) {
        visualizeDijkstra()
        document.querySelector("#start-visualization").removeEventListener("click", startVis)
    }
    else alert("ADD START AND END NODES")
}

function setupResetBTN() {
    document.querySelector("#refresh-page").addEventListener("click", () => {
        location.reload()
    })
}

function dijkstra(startNode, finishNode, grid) {
    isStarted = true
    startNode.distance = 0
    const visitedNodesInOrder = []
    const unvisitedNodes = grid.slice().flat()
    while (unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        if (!!closestNode.isWall) continue
        if (closestNode.distance === Infinity) return visitedNodesInOrder

        closestNode.isVisited = true
        visitedNodesInOrder.push(closestNode)
        if (closestNode === finishNode) return visitedNodesInOrder
        updateNeighborNodes(grid, closestNode)
    }
}

function visualizeDijkstra() {
    if (isStarted) return
    document.querySelector("#start-visualization").classList.add("disable-button")
    const visitedNodesInOrder = dijkstra(startNode, finishNode, grid)
    const shortestPathInOrder = getShortestPathInOrder(finishNode)
    animateDijkstra(visitedNodesInOrder, shortestPathInOrder)
}

function animateDijkstra(visitedNodesInOrder, shortestPathInOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
                animateShortestPath(shortestPathInOrder)
            }, 10 * i);
            return
        }
        if (i === visitedNodesInOrder.length - 1) continue
        if (visitedNodesInOrder[i] === undefined) console.log(i)
        setTimeout(() => {
            const node = visitedNodesInOrder[i]
            document.getElementById(node.id).classList.add("visited")
        }, 10 * i);
    }
}

function animateShortestPath(shortestPathInOrder) {
    if (shortestPathInOrder.length === 1) {
        alert("NO PATH FOUND")
        return
    }
    for (let i = 1; i < shortestPathInOrder.length - 1; i++) {
        setTimeout(() => {
            const node = shortestPathInOrder[i]
            document.getElementById(node.id).classList.add("path")
        }, 10 * 5 * i);
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

function updateNeighborNodes(grid, node) {
    const neighbors = getNeighbors(grid, node)
    neighbors.forEach(neighbor => {
        neighbor.distance = node.distance + 1
        neighbor.prevNode = node
    })
}

function getNeighbors(grid, node) {
    neighbors = []
    const { row, col } = node
    if (row > 0) neighbors.push(grid[row - 1][col])
    if (col < grid.length - 1) neighbors.push(grid[row][col + 1])
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
    if (col > 0) neighbors.push(grid[row][col - 1])

    return neighbors.filter(neighbor => !neighbor.isVisited)
}

function getShortestPathInOrder(finishNode) {
    const shortestPathInOrder = []
    let currentNode = finishNode
    while (currentNode !== null) {
        shortestPathInOrder.unshift(currentNode)
        currentNode = currentNode.prevNode
    }
    return shortestPathInOrder
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
                addStartFinishNodes(row, col, counter)
                counter++
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
    else if (counter === 1) {
        grid[row][col].isFinish = true
        finishNode = grid[row][col]
        document.getElementById(grid[row][col].id).classList.add("finish")
    }
    else return
}