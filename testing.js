
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

// Style for the cytoscape
const style = [
  {
    selector: "node", // Default node style
    style: {
      "shape": "round-rectangle",
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
      "shape": "ellipse",
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
  // {
  //   selector: ".red-edge", // Style for invalid connections
  //   style: {
  //     "line-color": "#ff4d4d",
  //     "target-arrow-color": "#ff4d4d",
  //     "line-style": "dashed",
  //   },
  // },
];

// Now your graph will look much cleaner and errors will be easier to spot! 🚀

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
//     depth += 100;
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
//       connectEdge(`edge_${current}->${back}`, current, back); // connect the edge to back
//       console.log("BACK  "+back)
//       const backContents = info.get(back);
//       if (backContents.front !== current) {
//         markRed(current);
//         markRed(back);
//       }
//     }

//     // check the interconnection between the front and right node if fails mark the both node as red
//     if (right) {
//       connectEdge(`edge_${current}->${right}`, current, right); // connect the edge to right
//       const rightContents = info.get(right);
//       if (rightContents.left !== current) {
//         markRed(current);
//         markRed(right);
//       }
//     }

//     if (left) {
//       connectEdge(`edge_${current}->${left}`, current, left); // connect the edge to left
//     }

//     if (front) {
//       connectEdge(`edge_${current}->${front}`, current, front); // connect the edge to front
//     }

//     current = right;
//     x += 100;
//   }
// };

// NOTE: This function travels from left to right and calls the other function to traverse front to back
const goLeftToRight = (startingPoint) => {
  let current = startingPoint;
  let width = 0; // controls the x axis
  while (current) {
    console.log("main: ", current);
    goFrontToBack(current, width);
    current = info.get(current).right;
    width += 100;
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
      connectEdge(`edge_${current}->${back}`, current, back); // connect the edge to back
      const backContents = info.get(back);
      addNode(back, backContents.label, x, y + 100);
      if (backContents.front !== current) {
        console.log("Back: ", back, "Current: ", current);
        markRed(current);
        markRed(back);
      }
    }

    // check the interconnection between the front and right node if fails mark the both node as red
    if (right) {
      connectEdge(`edge_${current}->${right}`, current, right); // connect the edge to right
      const rightContents = info.get(right);
      addNode(right, rightContents.label, x + 100, y);
      if (rightContents.left !== current) {
        console.log("Right: ", right, "Current: ", current);
        connectCheater(right);
        markRed(current);
        markRed(right);
      }
    }

    if (left) {
      connectEdge(`edge_${current}->${left}`, current, left); // connect the edge to left

      const leftElementContents = elements.get(left);
      const leftContents = info.get(left);

      if (!leftElementContents) {
        // If the left node is not yet created, create it
        // and mark the current and left node as red
        console.warn("Left node not found:", left, "While processing:", current);
        addNode(left, info.get(left).label, x - 50, y - 50 );
        markRed(current);
        markRed(left);
        connectCheater(left);
        // shiftNode(current, x + 25, y);
      } else if (
        leftElementContents.position.x == x &&
        leftElementContents.position.y == y
      ) {
        console.log("Position sharing detected between", left, "and", current);
        markRed(current);
        markRed(left);
        connectCheater(left);
        shiftNode(current, x + 25, y);
        shiftNode(left, x - 25, y);
      }

      if (leftContents.right !== current) {
        console.log("Left: ", left, "Current: ", current);
        markRed(current);
        markRed(left);
        connectCheater(left);
        markRed(leftContents.right);
        shiftNode(leftContents.right, x , y + 25);
        shiftNode(current, x, y-25);
      }

    }

    if (front) {
      connectEdge(`edge_${current}->${front}`, current, front); // connect the edge to front
    }

    current = back;
    y += 100;
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
const connectEdge = (edgeId, sourceId, targetId) => {
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
const markRed = (suspectNodeId) => {
  console.warn("Marking suspect node:", suspectNodeId);
  const element = elements.get(suspectNodeId);

  if (element) {
    if (element.classes) {
      // If classes already exist, append the new class
      element.classes += " red-node";
    } else {
      // If classes don't exist, create the classes property
      element.classes = "red-node";
    }

    // Apply inline style (always overwrite to ensure it's applied)
    // element.data.style = { "background-color": "green" };
    // console.log("Applied inline style:", element.data.style);

    elements.set(suspectNodeId, element); // Update the element in the map
  } else {
    console.error("SuspectNode not found for ID:", suspectNodeId);
  }
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
 connectEdge(`edge_${cheaterId}->${cheaterContents.front}`, cheaterId, cheaterContents.front);
 connectEdge(`edge_${cheaterId}->${cheaterContents.back}`, cheaterId, cheaterContents.back);
  connectEdge(`edge_${cheaterId}->${cheaterContents.left}`, cheaterId, cheaterContents.left);
  connectEdge(`edge_${cheaterId}->${cheaterContents.right}`, cheaterId, cheaterContents.right);
  markRed(cheaterId);
}


const startingPoint = getStartingPoint();
goLeftToRight(startingPoint);

const layout = {
  name: "preset",
};

const cy = cytoscape({
  container: document.getElementById("cy"),
  style,
  elements: Array.from(elements.values()),
  layout,
});
