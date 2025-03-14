// Organize the data in a proper Map structure
// NOTE: id(mac-address) => {label(name of student), front(mac-address of student in front), back, left, right}
const info = new Map(
  data.map(({ id, label, front, back, left, right }) => [
    id,
    { label, front, back, left, right },
  ])
);

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

// Function to get the starting key (TopLeft)
const getStartingPoint = () => {
  for (let [id, contents] of info) {
    if (!contents.front && !contents.left) {
      console.log("Starting Point: ", id);
      return id;
    }
  }
};

// NOTE: Here Iam using structured traversal where I go through each row line (from top-left to bottom-left) and in that row I traverse from left to right

// NOTE: This function is currently at hold because i thought to go left and for each step in left I traverse through top to bottom
// const goTopToBottom = (startingPoint) => {
//   let current = startingPoint;
//   let depth = 0; // controls the y axis
//   while (current) {
//     goLeftToRight(current, depth);
//     current = info.get(current).back;
//     depth += gap;
//   }
// };

// NOTE: This function traverses from Left to Right
// const goLeftToRight = (startingPoint, depth) => {
//   let current = startingPoint;
//   let x = 0;
//   let y = depth;
//   while (current) {

//     console.log(current)

//     // TODO: check do we need to check if the node already exists?
//     if (!elements.has(current)) {
//       addNode(current, info.get(current).label, x, y);
//     }

//     // Id of the neighboring nodes
//     const back = info.get(current).back;
//     const front = info.get(current).front;
//     const right = info.get(current).right;
//     const left = info.get(current).left;

//     // check the interconnection between the front and back node if fails mark the both node as red
//     if (back) {
//       connectEdge( current, back); // connect the edge to back
//       console.log("BACK  "+back)
//       const backContents = info.get(back);
//       if (backContents.front !== current) {
//         markNodeRed(current);
//         markNodeRed(back);
//       }
//     }

//     // check the interconnection between the front and right node if fails mark the both node as red
//     if (right) {
//       connectEdge(current, right); // connect the edge to right
//       const rightContents = info.get(right);
//       if (rightContents.left !== current) {
//         markNodeRed(current);
//         markNodeRed(right);
//       }
//     }

//     if (left) {
//       connectEdge(current, left); // connect the edge to left
//     }

//     if (front) {
//       connectEdge(current, front); // connect the edge to front
//     }

//     current = right;
//     x += gap;
//   }
// };

// NOTE: This function travels from left to right and calls the other function to traverse front to back
const goLeftToRight = (startingPoint, width = 0) => {
  let current = startingPoint;
  // let width = 0; // controls the x axis
  while (current) {
    console.log("main: ", current);
    goFrontToBack(current, width);
    current = info.get(current).right;
    width += gap;
  }
};

// NOTE: This function traverses from Left to Right
const goFrontToBack = (startingPoint, width) => {
  console.log("sub: ", startingPoint);
  let current = startingPoint;
  let y = 0;
  let x = width;
  while (current) {
    console.log("Loop elements of sub", current);

    // TODO: check do we need to check if the node already exists?
    if (!elements.has(current)) {
      addNode(current, info.get(current).label, x, y);
    }

    // Id of the neighboring nodes
    const back = info.get(current).back;
    const front = info.get(current).front;
    const right = info.get(current).right;
    const left = info.get(current).left;

    // check the interconnection between the front and back node if fails mark the both node as red
    if (back) {
      connectEdge(current, back); // connect the edge to back
      const backContents = info.get(back);
      addNode(back, backContents.label, x, y + gap);
      if (backContents.front !== current) {
        console.log("Back: ", back, "Current: ", current);
        markNodeRed(current);
        markNodeRed(back);
      }
    }

    // check the interconnection between the front and right node if fails mark the both node as red
    if (right) {
      connectEdge(current, right); // connect the edge to right
      const rightContents = info.get(right);
      addNode(right, rightContents.label, x + gap, y);
      if (rightContents.left !== current) {
        console.log("Right: ", right, "Current: ", current);
        connectCheater(right);
        markNodeRed(current);
        markNodeRed(right);
      }
    }

    if (left) {
      connectEdge(current, left); // connect the edge to left

      const leftElementContents = elements.get(left);
      const leftContents = info.get(left);
      if (!leftElementContents) {
        // If the left node is not yet created, create it
        // and mark the current and left node as red
        console.warn(
          "Left node not found:",
          left,
          "While processing:",
          current
        );
        addNode(
          left,
          info.get(left).label,
          x - gapPercent(50),
          y - gapPercent(50)
        );
        markNodeRed(current);
        markNodeRed(left);
        connectCheater(left);
        // shiftNode(current, x + gapPercent(25), y);
      } else if (
        leftElementContents.position.x == x &&
        leftElementContents.position.y == y
      ) {
        console.log("Position sharing detected between", left, "and", current);
        markNodeRed(current);
        markNodeRed(left);
        connectCheater(left);
        shiftNode(current, x + gapPercent(25), y);
        shiftNode(left, x - gapPercent(25), y);
      }

      if (leftContents.right !== current) {
        console.log("Left: ", left, "Current: ", current);
        markNodeRed(current);
        markNodeRed(left);
        console.log("-------connectcheater");
        connectCheater(left);
        console.log("-------connectLeft");
        markNodeRed(leftContents.right);
        if (leftContents.right) {
          shiftNode(leftContents.right, x, y + gapPercent(25));
          shiftNode(current, x, y - gapPercent(25));
        }
      }
    }

    if (front) {
      connectEdge(current, front); // connect the edge to front
    }
    visitedNode.add(current);
    current = back;
    y += gap;
  }
};

// Inserts Node to the cytoscape elements array at a given x and y coordinates
const addNode = (id, label, x, y) => {
  const element = {
    group: "nodes",
    data: { id, label },
    position: { x, y },
  };
  elements.set(id, element);
};

// Connects edge from source to targe
const connectEdge = (sourceId, targetId) => {
  const edgeId = `edge_${sourceId}->${targetId}`;
  if (elements.get(edgeId)) return;
  if (!sourceId || !targetId) {
    console.error("Invalid source or target for edge:", edgeId);
    return;
  }
  const element = {
    group: "edges",
    data: { id: edgeId, source: sourceId, target: targetId },
  };
  elements.set(edgeId, element);
};

// Marks the node red color (suspect)
const markNodeRed = (suspectNodeId) => {
  console.warn("Marking suspect node:", suspectNodeId);
  if (!suspectNodeId) {
    console.log("undefined suspect node");
    return;
  }
  const element = elements.get(suspectNodeId);

  if (element) {
    element.classes = "red-node";

    // Apply inline style (always overwrite to ensure it's applied)
    // element.data.style = { "background-color": "green" };
    // console.log("Applied inline style:", element.data.style);

    elements.set(suspectNodeId, element); // Update the element in the map
  } else {
    console.error("SuspectNode not found for ID:", suspectNodeId);
  }
};

// Marks the node red color (suspect)
const markEdgeRed = (sourceId, targetId) => {
  const edgeId = `edge_${sourceId}->${targetId}`;
  console.warn("Marking the edge:", edgeId);
  let element = elements.get(edgeId);
  if (!element) {
    connectEdge(sourceId, targetId);
    element = elements.get(edgeId);
  }

  element.classes = "red-edge";

  elements.set(edgeId, element); // Update the element in the map
};

// Shifts the position of the node
const shiftNode = (id, x, y) => {
  const element = elements.get(id);
  element.position = { x, y };
  elements.set(id, element);
};

// Traverse through all the nodes and check if there is any missing node if so mark it as red and add it to the elements

// NOTE: Connects the cheater node with other nodes
const connectCheater = (cheaterId) => {
  const cheaterContents = info.get(cheaterId);
  connectEdge(cheaterId, cheaterContents.front);
  connectEdge(cheaterId, cheaterContents.back);
  connectEdge(cheaterId, cheaterContents.left);
  connectEdge(cheaterId, cheaterContents.right);
  markNodeRed(cheaterId);
  visitedNode.add(cheaterId);
};

// NOTE: Similar to connectCheater but this connects the edge and marks it as red
const connectDisconnected = () => {
  console.log("-----connectDisconnected-----");
  for (let [nodeId, contents] of info) {
    if (!visitedNode.has(nodeId)) {
      // If the node is not explored
      // if (!elements.get(nodeId)) connectOrphanNode(nodeId)
      if (!elements.get(nodeId)) {
        if (isBackLeftExist(nodeId)) {
          console.log("--found broken node", nodeId);
          const x = getXPositionForOrphan(nodeId);
          goLeftToRight(nodeId, x);
          markEdgeRed(contents.left,nodeId)
          continue
        } else {
          continue;
        }
      }
      if (contents.front) {
        const frontContent = info.get(contents.front);
        // NOTE: A connection is broken from top to bottom
        if (!frontContent.back) {
          markEdgeRed(contents.front, nodeId);
        } else {
          connectEdge(contents.front, nodeId);
        }
        connectEdge(nodeId, contents.front);
      }
      if (contents.left) {
        const leftContent = info.get(contents.left);
        connectEdge(nodeId, contents.left);
        if (leftContent.right !== nodeId) {
          console.log("There is no connection form", contents.left, nodeId);
          markNodeRed(nodeId);
          markNodeRed(contents.left);
          markNodeRed(leftContent.right);
          const leftElement = elements.get(contents.left);
          // NOTE: shift to South East
          shiftNode(
            nodeId,
            leftElement.position.x + gapPercent(150),
            leftElement.position.y + gapPercent(50)
          );
        } else {
          connectEdge(contents.left, nodeId);
        }
      }
      if (contents.right) {
        const rightContent = info.get(contents.right);
        connectEdge(nodeId, contents.right);
        if (rightContent.left !== nodeId) {
          console.log("---------");
          console.log(nodeId);
          console.log(rightContent);
          markNodeRed(nodeId);
          markNodeRed(contents.right);
          markNodeRed(rightContent.left);
          const rightElement = elements.get(contents.right);
          // NOTE: shift to South East
          shiftNode(
            nodeId,
            rightElement.position.x - gapPercent(150),
            rightElement.position.y - gapPercent(50)
          );
        } else {
          connectEdge(contents.right, nodeId);
        }
      }
      visitedNode.add(nodeId);
    }
  }
};

// NOTE: Create a orphan node and guess its position based on backLeft node this case occurs if the node is missing in the first row
const connectOrphanNode = (nodeId) => {
  console.log("-----connectOrphanNode-----");
  const currentNode = info.get(nodeId);
  const backId = currentNode.back;
  const backLeftId = info.get(backId).left;
  const backLeftElement = elements.get(backLeftId);
  const { x, y } = backLeftElement.position;
  console.log(x, y);
  addNode(nodeId, currentNode.label, x + gap, y - gap);
  connectEdge(nodeId, currentNode.left);
  const leftNode = info.get(currentNode.left);
  markEdgeRed(currentNode.left, nodeId);
  leftNode.right = nodeId; // NOTE: Over write the node value
  // markNodeRed(currentNode.left)
  // markNodeRed(nodeId)
};

// NOTE: this gives the possible x coordinate for a given orphan node
const getXPositionForOrphan = (nodeId) => {
  console.log("------getXPositionForOrphan-----");
  const currentNode = info.get(nodeId);
  const backId = currentNode.back;
  const backLeftId = info.get(backId).left;
  const backLeftElement = elements.get(backLeftId);
  return backLeftElement.position.x + 100;
};

// NOTE: check if backLeft exist
const isBackLeftExist = (nodeId) => {
  console.log("------checkBackLeftExist-----");
  const currentNode = info.get(nodeId);
  if (currentNode.front) return;
  if (!currentNode) return;
  if (!elements.get(currentNode.left)) return
  const backId = currentNode.back;
  const backNode = info.get(backId);
  if (!backNode) return;
  const backLeftId = backNode.left;
  const backLeftElement = elements.get(backLeftId);
  if (!backLeftElement) return;
  return backLeftElement.position.x;
};

const startingPoint = getStartingPoint();
goLeftToRight(startingPoint);
// NOTE: connects the disconnected nodes
connectDisconnected();
const layout = {
  name: "preset",
};

const cy = cytoscape({
  container: document.getElementById("cy"),
  style,
  elements: Array.from(elements.values()),
  layout,
});
