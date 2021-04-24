export default function visualizeAStar(grid, startNode, finishNode) {
    document.querySelector("#start-visualization").classList.add("disable-button")
    const visitedNodesInOrder = AStar(startNode, finishNode, grid)
    const shortestPathInOrder = getShortestPathInOrder(finishNode)
    animateAlgo(visitedNodesInOrder, shortestPathInOrder)
}

function AStar(startNode, finishNode, grid) {
    const unvisitedNodes = grid.slice().flat()
    unvisitedNodes.forEach(node => {
        node.gScore = Infinity
        node.hScore = Infinity
    })
    
    const visitedNodesInOrder = []
    startNode.gScore = 0
    startNode.hScore = Math.abs(startNode.row - finishNode.row) + Math.abs(startNode.col - finishNode.col)
    
    while (unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        if (!!closestNode.isWall) continue
        if (closestNode.gScore === Infinity) return visitedNodesInOrder

        closestNode.isVisited = true
        visitedNodesInOrder.push(closestNode)
        if (closestNode === finishNode) return visitedNodesInOrder
        updateNeighborNodes(grid, finishNode, closestNode)
    }
}


function animateAlgo(visitedNodesInOrder, shortestPathInOrder) {
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
    unvisitedNodes.sort((nodeA, nodeB) => (nodeA.gScore + nodeA.hScore) - (nodeB.gScore + nodeB.hScore))
}

function updateNeighborNodes(grid, finishNode, node) {
    const neighbors = getNeighbors(grid, node)
    neighbors.forEach(neighbor => {
        neighbor.gScore = node.gScore + 1
        neighbor.hScore = Math.abs(neighbor.row - finishNode.row) + Math.abs(neighbor.col - finishNode.col)
        neighbor.prevNode = node
    })
}

function getNeighbors(grid, node) {
    const neighbors = []
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
