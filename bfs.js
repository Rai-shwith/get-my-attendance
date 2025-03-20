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
const gap = 100;
// provides the percentage w r t gap
const gapPercent = (percent) => (percent * gap) / 100;

//NOTE: The max Right and Front position of a node in the network
let maxRight = 0;
let maxFront = 0;
let maxCurrentLeft;

const setElement = (id,element) =>{
  // if (id == "A") abc
  elements.set(id,element)
}


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
    setElement(id, element);
    console.log("Added Node from shiftNode", id);
    visitedNode.add(id);
    return;
  }
  element.position = { x, y };
  setElement(id, element);
};

// Marks the node red color (suspect)
const markNodeRed = (suspectNodeId) => {
  if (!suspectNodeId) {
    return;
  }
  const element = elements.get(suspectNodeId);

  if (element) {
    element.classes = "red-node";
    setElement(suspectNodeId, element); // Update the element in the map
  } else {
  }
};

// Inserts Node to the cytoscape elements array at a given x and y coordinates
//TODO: improve this
const addNode = (id, label, x, y, addedByNode, parentDirection = null) => {
  // If the node already exists, return
  // Validate: If the the student gives false info of a same student
  if (elements.get(id)) return;
  if (!parentDirection) console.log("No parent direction for ", id);
  if (positionMap.has(`${x},${y}`)) {
    if (!checkNetworkExist(id, positionMap.get(`${x},${y}`).nodeId)) {
      console.error(
        "Overlap detected for ",
        id,
        "with (below)",
        positionMap.get(`${x},${y}`).nodeId,
        "parentDirection: ",
        parentDirection,
        " at position ",
        `${x},${y}`
      );
      console.log(positionMap);
      // if (!parentDirection || parentDirection == "left") maxCurrentLeft -=gap
      setElement(id, {
        group: "nodes",
        data: { id, label },
        position: { x, y },
      });
      return true;
      // if (toBeShifted) return shiftNetworkToRight(id);
      // return shiftNetworkToRight(positionMap.get(`${x},${y}`).id);
    }
    const FixPrimaryOverlap = positionMap.get(`${x},${y}`).FixPrimaryOverlap;
    if (!FixPrimaryOverlap) {
      const belowElementId = positionMap.get(`${x},${y}`).nodeId;
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
      positionMap.set(`${x},${y}`, { FixPrimaryOverlap: true, nodeId: id });
    }
    console.log("ParentDirection is ", parentDirection);
    if (!parentDirection)
      console.error(
        "Parent Direction is missing. And Nodes are overlapping. For id: ",
        id,
        "added by: ",
        addedByNode
      );
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
  setElement(id, element);
  addedBy.set(id, addedByNode);
  console.log("Added Node", id);
  visitedNode.add(id);
  positionMap.set(`${x},${y}`, { FixPrimaryOverlap: false, nodeId: id });
  return true;
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

  setElement(edgeId, element); // Update the element in the map
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
      const success = addNode(
        front,
        info.get(front).label,
        x,
        y - gap,
        nodeId,
        "front"
      );
      if (success) {
        if (y - gap < maxFront) maxFront -= gap;
        queue.push(front);
      }
    }
  }
  if (back) {
    const front = info.get(back).front;
    if (!front) markEdgeRed(back, nodeId);
    // console.log("back", back);
    connectEdge(nodeId, back);
    // validateMissingEdges(nodeId,back,'y');
    if (!visitedNode.has(back)) {
      addNode(back, info.get(back).label, x, y + gap, nodeId, "back") &&
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
      const success = addNode(
        left,
        info.get(left).label,
        x - gap,
        y,
        nodeId,
        "left"
      );
      if (success) {
        console.log("Left minus gap si ", x - gap, " ", x);
        maxCurrentLeft += gap;
        // if (x - gap < maxCurrentLeft) {
        // }
        queue.push(left);
      }
    }
  }
  if (right) {
    const left = info.get(right).left;
    if (!left) markEdgeRed(right, nodeId);
    // console.log("right", right);
    connectEdge(nodeId, right);
    // validateMissingEdges(nodeId,right,'x');
    if (!visitedNode.has(right)) {
      const success = addNode(
        right,
        info.get(right).label,
        x + gap,
        y,
        nodeId,
        "right"
      );
      if (success) {
        if (x + gap > maxRight) maxRight += gap;
        queue.push(right);
      }
    }
  }
};
// NOTE: Shifts the entire network to the right side with  gap
const shiftNetworkToRight = (nodeIdPrimary, shiftSize) => {
  console.log(
    "------shiftNetworkToRight-----: ",
    nodeIdPrimary,
    " Shift Size : ",
    shiftSize
  );
  const Queue = [nodeIdPrimary];
  const visited = new Set();
  while (Queue.length) {
    const nodeId = Queue.shift();
    console.log("---Node---", nodeId);
    console.log("Visited Node",visited);
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);
    const { front, back, left, right } = info.get(nodeId);
    // if (nodeId == "A") {
    //   console.log(front, elements.get(front));
    //   console.log(back, elements.get(back));
    //   console.log(left, elements.get(left));
    //   console.log(right, elements.get(right));
    //   // TODO: fix here
    //   return;
    // }
    if (front && !visited.has(front) && elements.get(front)) Queue.push(front);
    if (back && !visited.has(back) && elements.get(back)) Queue.push(back);
    if (left && !visited.has(left) && elements.get(left)) Queue.push(left);
    if (right && !visited.has(right) && elements.get(right)) Queue.push(right);
    const ele = elements.get(nodeId);
    console.log("---before---");
    console.log("x:", ele.position.x);
    console.log("y:", ele.position.y);
    positionMap.delete(`${ele.position.x},${ele.position.y}`);
    ele.position.x += shiftSize;
    console.log("---after---");
    console.log("x:", ele.position.x);
    console.log("y:", ele.position.y);
    setElement(nodeId, ele);
    positionMap.set(`${ele.position.x},${ele.position.y}`, {
      FixPrimaryOverlap: false,
      nodeId,
    });
  }
  console.log("shifted :", visited);
  return true;
};

// NOTE: Returns true if 2 nodes are connected in the network
const checkNetworkExist = (nodeId1, nodeId2) => {
  const Queue = [nodeId1];
  const visited = new Set();
  while (Queue.length) {
    const nodeId = Queue.shift();
    if (nodeId == nodeId2) return true;
    visited.add(nodeId);
    const { front, back, left, right } = info.get(nodeId);
    if (front && !visited.has(front)) Queue.push(front);
    if (back && !visited.has(back)) Queue.push(back);
    if (left && !visited.has(left)) Queue.push(left);
    if (right && !visited.has(right)) Queue.push(right);
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
  setElement(edgeId, element);
};

let flag = false;
for (let [key] of info) {
  if (elements.get(key)) continue;
  maxCurrentLeft = 0;
  console.log(key);
  // TODO: Add dynamic cy components for each key because in bfs every connected node is a connected
  console.log("Key Node <----------------------->", key);
  console.log("MaxRight: ", maxRight);
  console.log("MaxFront: ", maxFront);
  console.log("MaxCurrentLeft: ", maxCurrentLeft);
  addNode(key, info.get(key).label, maxRight, maxFront, null, null);
  connectBond(key);
  while (queue.length) {
    console.log("MaxCurrentLeft: ", maxCurrentLeft);
    console.log("Queue ----> ", queue);
    const nodeId = queue.shift();
    console.log("NodeID------->", nodeId);
    connectBond(nodeId);
    // if (nodeId == "bla") {
    if (false) {
      console.log("I broke the loop");
      flag = true;
      break;
    }
  }
  shiftNetworkToRight(key, maxCurrentLeft);
  if (flag) break;
}

const addNodeLater = () => {
  console.log(elementsLater);
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

function logNodePosition(cy) {
  cy.on("tap", "node", function (event) {
    let node = event.target;
    let position = node.position();
    console.log(
      `Node ${node.id()} clicked at x: ${position.x}, y: ${position.y}`
    );
  });
}

logNodePosition(cy);
