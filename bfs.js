// Organize the data in a proper Map structure
// NOTE: id(mac-address) => {label(name of student), front(mac-address of student in front), back, left, right}
const info = new Map(
  data.map(({ id, label, front, back, left, right }) => [
    id,
    { label, front, back, left, right },
  ])
);

// NOTE: The Queue for BFS
const queue = [];

// NOTE: Map to maintain the elements of cytoScape
const elements = new Map();

//NOTE: Map to maintain the visited nodes
const visitedNode = new Set();

// Style for the cytoscape
const style = [
  {
    selector: "node", // Default node style
    style: {
      shape: "round-rectangle",
      width: 50,
      // height: 40,
      "background-color": "#f0f0f0",
      "border-width": 2,
      "border-color": "#333",
      "border-opacity": 0.5,
      label: "data(label)",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "14px",
      color: "#333",
    },
  },
  {
    selector: ".red-node", // Class for red nodes
    style: {
      width: 35,
      height: 35,
      shape: "ellipse",
      "background-color": "red",
      "border-color": "#ff0000",
      "border-width": 3,
      color: "#fff",
      "z-index": 9999,
    },
  },
  {
    selector: "edge", // Default edge style
    style: {
      width: 3,
      "line-color": "#666",
      "curve-style": "bezier",
      "target-arrow-shape": "triangle",
      "target-arrow-color": "#666",
      "arrow-scale": 0.8,
    },
  },
  {
    selector: ".red-edge", // Style for invalid connections
    style: {
      "line-color": "#ff4d4d",
      "target-arrow-color": "#ff4d4d",
      "line-style": "dashed",
    },
  },
];

//NOTE: The gap between the nodes
const gap = 150;
// provides the percentage w r t gap
const gapPercent = (percent) => (percent * gap) / 100;

// Inserts Node to the cytoscape elements array at a given x and y coordinates
//TODO: improve this
const addNode = (id, label, x, y) => {
  // If the node already exists, return
  // Validate: If the the student gives false info of a same student
  if (elements.get(id)) return;
  const element = {
    group: "nodes",
    data: { id, label },
    position: { x, y },
  };
  elements.set(id, element);
  console.log("Added Node", id);
  visitedNode.add(id);
};

// Marks the node red color (suspect)
const markEdgeRed = (sourceId, targetId) => {
    const edgeId = `edge_${sourceId}->${targetId}`;
    if (!sourceId || !targetId) {
      return;
    }
    let element = elements.get(edgeId);
    if (!element) {
      connectEdge(sourceId, targetId);
      element = elements.get(edgeId);
    }
  
    element.classes = "red-edge";
  
    elements.set(edgeId, element); // Update the element in the map
  };


// NOTE: Function Validates if there is connection mismatch between edges or missing edges
const validateMissingEdges = (frontOrRightNode,backOrLeftNode,direction) => {
    if (direction == 'y'){ // Y - axis
        if (info.get(frontOrRightNode).back != backOrLeftNode){
            markEdgeRed(frontOrRightNode,backOrLeftNode);
        }
    } else { // X - axis
        if (info.get(frontOrRightNode).left != backOrLeftNode){
            markEdgeRed(frontOrRightNode,backOrLeftNode);
        }    
    }
}

// NOTE: BFS Algorithm
const connectBond = (nodeId) => {
  console.log("------------------");
  console.log("nodeId", nodeId);
  ele = elements.get(nodeId);
  if (!ele) return;
  const { x, y } = ele.position;
  const { front, back, left, right } = info.get(nodeId);

  if (front) {
    const back = info.get(front).back;
    if (!back) markEdgeRed(front, nodeId);
    console.log("front", front);
    connectEdge(nodeId, front);
    if (!visitedNode.has(front)) {
      addNode(front, info.get(front).label, x, y - gap);
      queue.push(front);
    }
  }
  if (back) {
    const front = info.get(back).front;
    if (!front) markEdgeRed(back, nodeId);
    console.log("back", back);
    connectEdge(nodeId, back);
    // validateMissingEdges(nodeId,back,'y');
    if (!visitedNode.has(back)) {
      addNode(back, info.get(back).label, x, y + gap);
      queue.push(back);
    }
  }
  if (left) {
    const right = info.get(left).right;
    if (!right) markEdgeRed(left, nodeId);
    console.log("left", left);
    connectEdge(nodeId, left);
    // validateMissingEdges(nodeId,left,'x');
    if (!visitedNode.has(left)) {
      addNode(left, info.get(left).label, x - gap, y);
      queue.push(left);
    }
  }
  if (right) {
    const left = info.get(right).left;
    if (!left) markEdgeRed(right, nodeId);
    console.log("right", right);
    connectEdge(nodeId, right);
    // validateMissingEdges(nodeId,right,'x');
    if (!visitedNode.has(right)) {
      addNode(right, info.get(right).label, x + gap, y);
      queue.push(right);
    }
  }
};

// Connects edge from source to targe
//   TODO: improve this
const connectEdge = (sourceId, targetId) => {
  const edgeId = `edge_${sourceId}->${targetId}`;
  if (elements.get(edgeId)) return;
  if (!sourceId || !targetId) {
    return;
  }
  const element = {
    group: "edges",
    data: { id: edgeId, source: sourceId, target: targetId },
  };
  elements.set(edgeId, element);
};

for (let [key] of info) {
  if (elements.get(key)) continue;
  console.log(key);
  // TODO: Add dynamic cy components for each key because in bfs every connected node is a connected
  console.log("Key Node---<>", key);
  addNode(key, info.get(key).label, 0, 0);
  connectBond(key);
  while (queue.length) {
    console.log("Queue ----> ", queue);
    const nodeId = queue.shift();
    console.log("NodeID------->", nodeId);
    connectBond(nodeId);
  }
}

// Marks the node red color (suspect)
const markNodeRed = (suspectNodeId) => {
  if (!suspectNodeId) {
    return;
  }
  const element = elements.get(suspectNodeId);

  if (element) {
    element.classes = "red-node";

    // Apply inline style (always overwrite to ensure it's applied)
    // element.data.style = { "background-color": "green" };

    elements.set(suspectNodeId, element); // Update the element in the map
  } else {
  }
};



// Shifts the position of the node
const shiftNode = (id, x, y) => {
  const element = elements.get(id);
  element.position = { x, y };
  elements.set(id, element);
};

const layout = {
  name: "preset",
};

const cy = cytoscape({
  container: document.getElementById("cy"),
  style,
  elements: Array.from(elements.values()),
  layout,
});
