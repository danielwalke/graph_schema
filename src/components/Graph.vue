<script setup lang="ts">
import {onMounted, ref} from "vue"
import * as vNG from "v-network-graph"
import data from "../data/Data"


onMounted(()=>{
  console.log(data)
})


function showContextMenu(element: HTMLElement, event: MouseEvent) {
  element.style.left = event.x + "px"
  element.style.top = event.y + "px"
  element.style.visibility = "visible"
  const handler = (event: PointerEvent) => {
    if (!event.target || !element.contains(event.target as HTMLElement)) {
      element.style.visibility = "hidden"
      document.removeEventListener("pointerdown", handler, { capture: true })
    }
  }
  document.addEventListener("pointerdown", handler, { passive: true, capture: true })
}

const viewMenu = ref<HTMLDivElement>()
function showViewContextMenu(params: vNG.ViewEvent<MouseEvent>) {
  const { event } = params
  // Disable browser's default context menu
  event.stopPropagation()
  event.preventDefault()
  if (viewMenu.value) {
    showContextMenu(viewMenu.value, event)
  }
}

const nodeMenu = ref<HTMLDivElement>()
const menuTargetNode = ref("")
function showNodeContextMenu(params: vNG.NodeEvent<MouseEvent>) {
  const { node, event } = params
  // Disable browser's default context menu
  event.stopPropagation()
  event.preventDefault()
  if (nodeMenu.value) {
    menuTargetNode.value = JSON.stringify(data.nodes[node]) ?? ""
    showContextMenu(nodeMenu.value, event)
  }
}

const edgeMenu = ref<HTMLDivElement>()
const menuTargetEdges = ref<string>("")
function showEdgeContextMenu(params: vNG.EdgeEvent<MouseEvent>) {
  const { edge, event } = params
  // Disable browser's default context menu
  event.stopPropagation()
  event.preventDefault()
  if (edgeMenu.value) {
    menuTargetEdges.value = edge ? JSON.stringify(data.edges[edge]) : ""
    showContextMenu(edgeMenu.value, event)
  }
}

const eventHandlers: vNG.EventHandlers = {
  "view:contextmenu": showViewContextMenu,
  "node:contextmenu": showNodeContextMenu,
  "edge:contextmenu": showEdgeContextMenu,
}
</script>

<template>
  <div class="w-full h-full">
    <v-network-graph
        :nodes="data.nodes"
        :edges="data.edges"
        :layouts="data.layouts"
        :configs="data.configs"
        :event-handlers="eventHandlers"
    >
      <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label :text="edge.name" align="center" vertical-align="above" v-bind="slotProps" />
    </template>

    </v-network-graph>
    <div ref="viewMenu" class="context-menu">Menu for the background</div>
    <div ref="nodeMenu" class="context-menu">
      Menu for the nodes
      <div>{{ menuTargetNode }}</div>
    </div>
    <div ref="edgeMenu" class="context-menu">
      Menu for the edges
      <div>{{ menuTargetEdges }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.context-menu {
  width: 180px;
  background-color: #efefef;
  padding: 10px;
  position: fixed;
  visibility: hidden;
  font-size: 12px;
  border: 1px solid #aaa;
  box-shadow: 2px 2px 2px #aaa;
  > div {
    border: 1px dashed #aaa;
    padding: 4px;
    margin-top: 8px;
  }
}
</style>