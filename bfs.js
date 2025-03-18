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

// NOTE: A Map for taking care of overlapping nodes
const positionMap = new Map();

// NOTE: Map to maintain the elements of cytoScape
const elements = new Map();

// NOTE: Elements to add later in cytoScape
const elementsLater = new Array();

// NOTE: Keep track of who added who because to shift the conflicted nodes
const addedBy = new Map();

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
      "arrow-scale": 1.5,
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

const getAValidDirection = (nodeId) => {
  console.log("-----getAValidDirection------", nodeId);
  const node = info.get(nodeId);
  const addedByNode = addedBy.get(nodeId);
  console.log("Added By Node", addedByNode);
  if (!addedBy) {
    throw new Error("Node not found for (overlapped)", nodeId);
  }
  const { front, back, left, right } = info.get(addedByNode);
  if (front == nodeId) return "back";
  if (back == nodeId) return "front";
  if (left == nodeId) return "right";
  if (right == nodeId) return "left";
};

// Shifts the position of the node
const shiftNode = (id, x, y, label = null) => {
  console.log("------Shift Node------: ", id);
  markNodeRed(id);
  let element = elements.get(id);
  if (!element) {
    console.error("Element not found for ", id);
    console.log("So creating the node");
    const element = {
      group: "nodes",
      data: { id, label },
      position: { x, y },
    };
    elements.set(id, element);
    console.log("Added Node from shiftNode", id);
    visitedNode.add(id);
    return;
  }
  element.position = { x, y };
  elements.set(id, element);
};

// Marks the node red color (suspect)
const markNodeRed = (suspectNodeId) => {
  if (!suspectNodeId) {
    return;
  }
  const element = elements.get(suspectNodeId);

  if (element) {
    element.classes = "red-node";
    elements.set(suspectNodeId, element); // Update the element in the map
  } else {
  }
};

// Inserts Node to the cytoscape elements array at a given x and y coordinates
//TODO: improve this
const addNode = (id, label, x, y,addedByNode, parentDirection = null) => {
  // If the node already exists, return
  // Validate: If the the student gives false info of a same student
  if (elements.get(id)) return;
  if (!parentDirection) console.log("No parent direction for ", id);
  if (positionMap.has(`${x},${y}`)) {
    const FixPrimaryOverlap = positionMap.get(`${x},${y}`).FixPrimaryOverlap;
    if (!FixPrimaryOverlap) {
      const belowElementId = positionMap.get(`${x},${y}`).id;
      console.log("overlap: ", belowElementId, "<-->", id);
      const direction = getAValidDirection(belowElementId);
      console.log("valid direction is ------->", direction);
      positionMap.set(`${x},${y}`, true);
      if (direction == "front")
        shiftNode(belowElementId, x, y - gapPercent(50));
      if (direction == "back") shiftNode(belowElementId, x, y + gapPercent(50));
      if (direction == "left") shiftNode(belowElementId, x - gapPercent(50), y);
      if (direction == "right")
        shiftNode(belowElementId, x + gapPercent(50), y);
      positionMap.set(`${x},${y}`, { FixPrimaryOverlap: true, id });
    }
    console.log("ParentDirection is ", parentDirection);
    if (!parentDirection)
      console.error("Parent Direction is missing. And Nodes are overlapping. For id: ",id,"added by: ",addedByNode);
    let laterData;
    if (parentDirection == "front")
      laterData = { id, x, y: y + gapPercent(50), label };
    if (parentDirection == "back")
      laterData = { id, x, y: y - gapPercent(50), label };
    if (parentDirection == "left")
      laterData = { id, x: x + gapPercent(50), y, label };
    if (parentDirection == "right")
      laterData = { id, x: x - gapPercent(50), y, label };
    elementsLater.push(laterData);
  }

  const element = {
    group: "nodes",
    data: { id, label },
    position: { x, y },
  };
  elements.set(id, element);
  addedBy.set(id, addedByNode);
  console.log("Added Node", id);
  visitedNode.add(id);
  positionMap.set(`${x},${y}`, { FixPrimaryOverlap: false, id });
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
const validateMissingEdges = (frontOrRightNode, backOrLeftNode, direction) => {
  if (direction == "y") {
    // Y - axis
    if (info.get(frontOrRightNode).back != backOrLeftNode) {
      markEdgeRed(frontOrRightNode, backOrLeftNode);
    }
  } else {
    // X - axis
    if (info.get(frontOrRightNode).left != backOrLeftNode) {
      markEdgeRed(frontOrRightNode, backOrLeftNode);
    }
  }
};

// NOTE: BFS Algorithm
const connectBond = (nodeId) => {
  ele = elements.get(nodeId);
  if (!ele) return;
  const { x, y } = ele.position;
  const { front, back, left, right } = info.get(nodeId);

  if (front) {
    const back = info.get(front).back;
    if (!back) markEdgeRed(front, nodeId);
    // console.log("front", front);
    connectEdge(nodeId, front);
    if (!visitedNode.has(front)) {
      addNode(front, info.get(front).label, x, y - gap,nodeId, "front");
      queue.push(front);
    }
  }
  if (back) {
    const front = info.get(back).front;
    if (!front) markEdgeRed(back, nodeId);
    // console.log("back", back);
    connectEdge(nodeId, back);
    // validateMissingEdges(nodeId,back,'y');
    if (!visitedNode.has(back)) {
      addNode(back, info.get(back).label, x, y + gap,nodeId, "back");
      queue.push(back);
    }
  }
  if (left) {
    const right = info.get(left).right;
    if (!right) markEdgeRed(left, nodeId);
    // console.log("left", left);
    connectEdge(nodeId, left);
    // validateMissingEdges(nodeId,left,'x');
    if (!visitedNode.has(left)) {
      addNode(left, info.get(left).label, x - gap, y,nodeId, "left");
      queue.push(left);
    }
  }
  if (right) {
    const left = info.get(right).left;
    if (!left) markEdgeRed(right, nodeId);
    // console.log("right", right);
    connectEdge(nodeId, right);
    // validateMissingEdges(nodeId,right,'x');
    if (!visitedNode.has(right)) {
      addNode(right, info.get(right).label, x + gap, y,nodeId, "right");
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

let i = 0;
for (let [key] of info) {
  if (elements.get(key)) continue;
  console.log(key);
  // TODO: Add dynamic cy components for each key because in bfs every connected node is a connected
  console.log("Key Node---<>", key);
  addNode(key, info.get(key).label, i*10*gap, 0, null);
  i++;
  connectBond(key);
  while (queue.length) {
    // console.log("Queue ----> ", queue);
    const nodeId = queue.shift();
    console.log("NodeID------->", nodeId);
    connectBond(nodeId);
  }
}

const addNodeLater = () => {
  console.log(elementsLater)
  for (let { id, x, y } of elementsLater) {
    const node = cy.getElementById(id);
    node.position({ x, y });
    node.classes("red-node");
  }
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

addNodeLater();
