import { Nodes, Edges, Layouts, defineConfigs } from "v-network-graph"
import edges_json from "./edges.json"
import nodes_json from "./nodes.json"
import {
    ForceLayout,
    ForceNodeDatum,
    ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"
console.log(edges_json)
const nodes: Nodes = nodes_json

const edges: Edges = edges_json

const layouts: Layouts = {
    nodes: {
        node1: { x: 0, y: 0 },
        node2: { x: 80, y: 80 },
        node3: { x: 160, y: 0 },
        node4: { x: 240, y: 80 },
    },
}

const configs = defineConfigs({
    node: {
      normal: {
          radius: 8
      }
    },
    edge: {
        normal: {
            width: 3,
        },
    },
    view: {
        layoutHandler: new ForceLayout({
            positionFixedByDrag: true,
            positionFixedByClickWithAltKey: true,
            createSimulation: (d3, nodes, edges) => {
                // d3-force parameters
                const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
                // Compute node degrees
                /*const linkForce = d3.forceLink()
                    .id(d => d.id)
                    .distance(d => 50 + 5 * Math.sqrt(d.source.degree + d.target.degree)) // Increase distance slightly for highly connected nodes
                    .strength(d => 0.2 + 0.8 / Math.sqrt(d.source.degree + d.target.degree)); // Keep structure tighter
                console.log(linkForce)*/
                return d3.forceSimulation(nodes)
                    .force("edge", forceLink.distance(20).strength(0.5))
                    .force("charge", d3.forceManyBody().strength(-10)) // Reduce repulsion to prevent excessive spreading
                    .force("center", d3.forceCenter()) // Center without excessive attraction
                    .alpha(1) // Start with higher energy for layout stabilization
                    .alphaDecay(0.02) // Slow decay for better layout
                    .alphaMin(0.002); // Ensure it settles but not too quickly
            }
        }),
    },
})

export default {
    nodes,
    edges,
    layouts,
    configs,
}