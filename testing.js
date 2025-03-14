// Raw data from the backend
const data = [
  { id: "A", label: "A", front: null, back: "D", left: null, right: "B" },
  { id: "B", label: "B", front: null, back: "E", left: "A", right: "C" },
  { id: "C", label: "C", front: null, back: "F", left: "B", right: null },
  { id: "D", label: "D", front: "A", back: "Z", left: null, right: "E" },
  { id: "E", label: "E", front: "B", back: null, left: "D", right: "F" },
  { id: "F", label: "F", front: "C", back: null, left: "E", right: null },
  { id: "Z", label: "Z", front: "E", back: null, left: null, right: null },
];

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
      "background-color": "#f0f0f0",
      "border-width": 2,
      "border-color": "#333",
      "border-opacity": 0.5,
      "label": "data(label)",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "14px",
      "color": "#333",
    },
  },
  {
    selector: ".red-node", // Class for red nodes
    style: {
      "background-color": "red",
      "border-color": "#ff0000",
      "border-width": 3,
      "color": "#fff",
    },
  },
  {
    selector: "edge", // Default edge style
    style: {
      "width": 3,
      "line-color": "#666",
      "curve-style": "bezier",
      "target-arrow-shape": "triangle",
      "target-arrow-color": "#666",
      "arrow-scale": 1.5,
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
      return id;
    }
  }
};

// NOTE: Here Iam using structured traversal where I go through each row line (from top-left to bottom-left) and in that row I traverse from left to right
const goTopToBottom = (startingPoint) => {
  let current = startingPoint;
  let depth = 0; // controls the y axis
  while (current) {
    goLeftToRight(current, depth);
    current = info.get(current).back;
    depth += 100;
  }
};

// NOTE: This function traverses from Left to Right
const goLeftToRight = (startingPoint, depth) => {
  let current = startingPoint;
  let x = 0;
  let y = depth;
  while (current) {

    console.log(current)

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
      console.log("BACK  "+back)
      const backContents = info.get(back);
      if (backContents.front !== current) {
        markRed(current);
        markRed(back);
      }
    }

    // check the interconnection between the front and right node if fails mark the both node as red
    if (right) {
      connectEdge(`edge_${current}->${right}`, current, right); // connect the edge to right
      const rightContents = info.get(right);
      if (rightContents.left !== current) {
        markRed(current);
        markRed(right);
      }
    }

    if (left) {
      connectEdge(`edge_${current}->${left}`, current, left); // connect the edge to left
    }

    if (front) {
      connectEdge(`edge_${current}->${front}`, current, front); // connect the edge to front
    }

    current = right;
    x += 100;
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
  const element = {
    group: "edges",
    data: { id: edgeId, source: sourceId, target: targetId },
  };
  elements.set(edgeId, element);
};

// Marks the node red color (suspect)
const markRed = (suspectNodeId) => {
  console.log("Marking suspect node:", suspectNodeId);
  const element = elements.get(suspectNodeId);

  if (element) {
    console.log("Found element:", element); // Log the element before modification

    if (element.data.classes) {
      // If classes already exist, append the new class
      element.data.classes += " red-node";
      console.log("Appended class:", element.data.classes);
    } else {
      // If classes don't exist, create the classes property
      element.data.classes = "red-node";
      console.log("Created class:", element.data.classes);
    }

    // Apply inline style (always overwrite to ensure it's applied)
    element.data.style = { "background-color": "green" };
    console.log("Applied inline style:", element.data.style);

    elements.set(suspectNodeId, element); // Update the element in the map
    console.log("Updated elements map:", elements.get(suspectNodeId)); // Log the updated element

  } else {
    console.log("Element not found for ID:", suspectNodeId);
  }
};

const startingPoint = getStartingPoint();
goTopToBottom(startingPoint);

console.log(Array.from(elements.values()));
const cy = cytoscape({
  container: document.getElementById("cy"),
  style,
  elements: Array.from(elements.values()),
  layout: {
    name: "preset",
  },
});
