// function generateGridConnectedNetwork(numNodes, rowSize) {
//   const elements = [];
//   const numRows = Math.ceil(numNodes / rowSize);

//   for (let i = 0; i < numNodes; i++) {
//     const id = `node${i}`;
//     elements.push({ data: { id: id, label: `Node ${i}` } });
//   }

//   for (let i = 0; i < numNodes; i++) {
//     const currentRow = Math.floor(i / rowSize);
//     const currentCol = i % rowSize;

//     // Connect to right
//     if (currentCol < rowSize - 1 && i + 1 < numNodes) {
//       elements.push({
//         data: {
//           id: `edge_${i}_${i + 1}`,
//           source: `node${i}`,
//           target: `node${i + 1}`,
//         },
//       });
//     }

//     // Connect to left
//     if (currentCol > 0) {
//       elements.push({
//         data: {
//           id: `edge_${i}_${i - 1}`,
//           source: `node${i}`,
//           target: `node${i - 1}`,
//         },
//       });
//     }

//     // Connect to below
//     if (currentRow < numRows - 1 && i + rowSize < numNodes) {
//       elements.push({
//         data: {
//           id: `edge_${i}_${i + rowSize}`,
//           source: `node${i}`,
//           target: `node${i + rowSize}`,
//         },
//       });
//     }

//     // Connect to above
//     if (currentRow > 0) {
//       elements.push({
//         data: {
//           id: `edge_${i}_${i - rowSize}`,
//           source: `node${i}`,
//           target: `node${i - rowSize}`,
//         },
//       });
//     }
//   }

//   return elements;
// }


function generateGridConnectedNetwork(numNodes, rowSize) {
  const elements = [];
  const numRows = Math.ceil(numNodes / rowSize);

  for (let i = 0; i < numNodes; i++) {
    const id = `node${i}`;
    elements.push({
      data: { id: id, label: `Node ${i}` },
    });
  }

  for (let i = 0; i < numNodes; i++) {
    const currentRow = Math.floor(i / rowSize);
    const currentCol = i % rowSize;

    // Connect to right
    if (currentCol < rowSize - 1 && i + 1 < numNodes) {
      elements.push({
        data: {
          id: `edge_${i}_${i + 1}`,
          source: `node${i}`,
          target: `node${i + 1}`,
          direction: "right",
        },
      });
    }

    // Connect to left
    if (currentCol > 0) {
      elements.push({
        data: {
          id: `edge_${i}_${i - 1}`,
          source: `node${i}`,
          target: `node${i - 1}`,
          direction: "left",
        },
      });
    }

    // Connect to below
    if (currentRow < numRows - 1 && i + rowSize < numNodes) {
      elements.push({
        data: {
          id: `edge_${i}_${i + rowSize}`,
          source: `node${i}`,
          target: `node${i + rowSize}`,
          direction: "down",
        },
      });
    }

    // Connect to above
    if (currentRow > 0) {
      elements.push({
        data: {
          id: `edge_${i}_${i - rowSize}`,
          source: `node${i}`,
          target: `node${i - rowSize}`,
          direction: "up",
        },
      });
    }
  }

  return elements;
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  

const cols = 10;
const nodes = 28;
// Example usage: 25 nodes, 5 nodes per row
const gridNetwork = generateGridConnectedNetwork(nodes, cols);
[gridNetwork[0],gridNetwork[1]] = [gridNetwork[1],gridNetwork[0]]
console.log((gridNetwork));

// Example usage: 32 nodes, 8 nodes per row.
// const gridNetwork2 = generateGridConnectedNetwork(32, 5);
// console.log(gridNetwork2);

//Example usage 10 nodes, 3 nodes per row.
// const gridNetwork3 = generateGridConnectedNetwork(10, 3);
// console.log(gridNetwork3);

const elements = gridNetwork;

// const elements = [
//     // Nodes
//     { data: { id: "a", label: "Node A" }, position: { x: 100, y: 150 } },
//     { data: { id: "b", label: "Node B" }, position: { x: 300, y: 150 } },
//     { data: { id: "c", label: "Node C" }, position: { x: 200, y: 300 } },
//     { data: { id: "d", label: "Node D" }, position: { x: 400, y: 300 } },
//     { data: { id: "e", label: "Node E" }, position: { x: 500, y: 100 } },
//     { data: { id: "f", label: "Node F" }, position: { x: 600, y: 200 } },
//     { data: { id: "g", label: "Node G" }, position: { x: 700, y: 300 } },

//     // Edges
//     { data: { id: "ab", source: "a", target: "b" } },
//     { data: { id: "bc", source: "b", target: "c" } },
//     { data: { id: "cd", source: "c", target: "d" } },
//     { data: { id: "de", source: "d", target: "e" } },
//     { data: { id: "ef", source: "e", target: "f" } },
//     { data: { id: "fg", source: "f", target: "g" } },
//     { data: { id: "ac", source: "a", target: "c" } },
//     { data: { id: "be", source: "b", target: "e" } },
//     { data: { id: "cf", source: "c", target: "f" } }
//   ];

const layoutOptions = {
  name: "grid",
  padding: 10,
  cols: cols,
  fit: true,
  transform: function (node, position) {
    if (node.id() === "node14") {
      node.style({
        "background-color": "#FF4136",
        "z-index": 9999, // Bring the node to the top
      });
      return {
        x: position.x + 50, // Move this node 200px to the right
        y: position.y, // Move this node 100px down
      };
    }
    return position; // Return the original position for other nodes
  },
};

const cy = cytoscape({
  container: document.getElementById("cy"),
  elements: elements,
  style: [
    {
      selector: "node",
      style: {
        "background-color": "#0074D9",
        label: "data(label)",
        "font-size": "10%",
        "text-valign": "center",
        color: "#fff",
        width: 50,
        height: 50,
      },
    },
    {
      selector: "edge",
      style: {
        width: 3,
        "line-color": "#000",
        "target-arrow-color": "#000",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
      },
    },
  ],
  layout: layoutOptions,
  //   zoomingEnabled: false,
  //   panningEnabled: false,
  //   // Disable node dragging if you want them fixed in position
  //   userPanningEnabled: true,
  //   boxSelectionEnabled: false,
  //   grabify:true
});

cy.nodes().ungrabify();

cy.on("tap", "node", function (evt) {
  const node = evt.target;

  // Get the position in graph coordinates
  const position = node.position();

  // Get the screen position (accounting for zoom and pan)
  const renderedPosition = node.renderedPosition();

  console.log("Tapped node:", node.data());
  console.log("Graph Position -> x:", position.x, "y:", position.y);
  console.log(
    "Screen Position -> x:",
    renderedPosition.x,
    "y:",
    renderedPosition.y
  );
});

function addNodeToGrid(id, label) {
  const totalNodes = cy.nodes().length;

  // Calculate position for the new node
  const row = Math.floor(totalNodes / cols);
  const col = totalNodes % cols;

  cy.add({
    data: { id: id, label: label },
    position: { x: col * 10, y: row * 10 }, // Adjust spacing as needed
  });

  const newNode = cy.getElementById(id);
  newNode.style("background-color", "red");
  newNode.grabify();

  // Run the layout again to organize everything
  //   cy.layout(layoutOptions).run();
}

// addNodeToGrid("newNode1", "New Node 1");
// addNodeToGrid("newNode2", "New Node 2");

function removeNodeById(nodeId) {
  const node = cy.getElementById(nodeId);
  if (node.nonempty()) {
    console.log(node);
    createArrowBetweenNodes(getNeighborsWithDirection(nodeId,'right'),getNeighborsWithDirection(nodeId,'left'))
    createArrowBetweenNodes(getNeighborsWithDirection(nodeId,'left'),getNeighborsWithDirection(nodeId,'right'))
    createArrowBetweenNodes(getNeighborsWithDirection(nodeId,'up'),getNeighborsWithDirection(nodeId,'down'))
    createArrowBetweenNodes(getNeighborsWithDirection(nodeId,'down'),getNeighborsWithDirection(nodeId,'up'))
    node.remove();
    //   cy.layout(layoutOptions).run();
    console.log(`Node ${nodeId} removed.`);
  } else {
    console.log(`Node ${nodeId} not found.`);
  }
}

function createArrowBetweenNodes(sourceId, targetId, direction = '') {
    // Create a unique edge ID
    const edgeId = `edge_${sourceId}_${targetId}`;
  
    // Check if the edge already exists to avoid duplicates
    if (cy.getElementById(edgeId).length === 0) {
      cy.add({
        data: {
          id: edgeId,
          source: sourceId,
          target: targetId,
          direction: direction, 
        },
      });
  
      console.log(`Created arrow from ${sourceId} to ${targetId} (Direction: ${direction || 'N/A'})`);
    } else {
      console.log(`Arrow between ${sourceId} and ${targetId} already exists.`);
    }
  }
  

function getNeighborsWithDirection(nodeId) {
  const node = cy.getElementById(nodeId);
  const connectedEdges = node.connectedEdges();

  const neighbors = connectedEdges.map((edge) => {
    const source = edge.source().id();
    const target = edge.target().id();
    const direction = edge.data("direction");

    // Determine the neighbor based on source/target
    const neighborId = source === nodeId ? target : source;
    const info = { neighborId, direction };
    console.log(info);
    return info;
  });

  return neighbors;
}

function getNeighborsWithDirection(nodeId, direction) {
    const neighbors = getNeighborsWithDirection(nodeId);
    const target = neighbors.find(n => n.direction === direction);
    
    return target;
  }
  

removeNodeById("node5");
function getNeighboringNodes(nodeId) {
    const node = cy.getElementById(nodeId);
  
    if (!node.empty()) {
      const neighbors = node.connectedEdges().map((edge) => {
        return edge.connectedNodes().filter((n) => n.id() !== nodeId);
      });
  
      return neighbors;
    } else {
      console.log("Node not found!");
      return [];
    }
  }
  
  // Example usage
  const surroundingNodes = getNeighboringNodes("node14");
  console.log("Surrounding nodes:", surroundingNodes.map((n) => n.data("id")));
  