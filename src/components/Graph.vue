<script setup lang="ts">
import {onMounted, ref} from "vue"
import * as vNG from "v-network-graph"
import data from "../data/Data"
import {saveAs} from "file-saver";
import "../style.css"

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
    menuTargetNode.value = JSON.stringify(data.nodes.value[node]) ?? ""
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
    menuTargetEdges.value = edge ? JSON.stringify(data.edges.value[edge]) : ""
    showContextMenu(edgeMenu.value, event)
  }
}

const eventHandlers: vNG.EventHandlers = {
  "view:contextmenu": showViewContextMenu,
  "node:contextmenu": showNodeContextMenu,
  "edge:contextmenu": showEdgeContextMenu,
}

function download(){
  const graph = {
    "nodes": data.nodes.value,
    "edges": data.edges.value
  }
  const blob:Blob = new Blob(new Array(JSON.stringify(graph, null, 2)), {type: "text/plain;charset=utf-8"});
  saveAs(blob, "graph.json")
}

function upload(e:Event){
  const reader = new FileReader()
  reader.readAsText(e.target.files[0])
  reader.onload = e => {
    const result = e.target.result.trim()
    const graph = JSON.parse(result)
    console.log(graph.nodes)
    data.nodes.value = graph.nodes
    data.edges.value = graph.edges
  }
  console.log("Upload")
}

function downloadNodesList(){
  const node_names:string[] = ["name"]
  for(const node_key in data.nodes.value){
    node_names.push(node_key)
  }
  const blob:Blob = new Blob([node_names.join("\n")], {type: 'plain/text'});
  saveAs(blob, "nodes_list.csv")
}

function downloadNodesDetailsList(){
  const sep:string = ";"
  const nodes_infos:string[] = [`name${sep}dataSource${sep}isMappingLabel${sep}count${sep}properties`]
  for(const node_key in data.nodes.value){
    const node_info:object = data.nodes.value[node_key]
    const node_info_str:string = `${node_key}${sep}${node_info.dataSourceId}${sep}${node_info.isMappingLabel.toString()}${sep}${node_info.count.toString()}${sep}${JSON.stringify(node_info.properties)}`
    nodes_infos.push(node_info_str)
  }
  const blob:Blob = new Blob([nodes_infos.join("\n")], {type: 'plain/text'});
  saveAs(blob, "nodes_infos.csv")
}

function downloadEdges(){
  const sep:string = ";"
  const edge_infos:string[] = [`name${sep}source${sep}target`]
  for(const edge_key in data.edges.value){
    const edge_info:object = data.edges.value[edge_key]
    const edge_info_str:string = `${edge_info.name}${sep}${edge_info.source}${sep}${edge_info.target}`
    edge_infos.push(edge_info_str)
  }
  const blob:Blob = new Blob([edge_infos.join("\n")], {type: 'plain/text'});
  saveAs(blob, "edges_list.csv")
}

function downloadEdgesDetailsList(){
  const sep:string = ";"
  const edge_infos:string[] = [`name${sep}dataSource${sep}isMappingLabel${sep}count${sep}source${sep}target${sep}properties`]
  for(const edge_key in data.edges.value){
    const edge_info:object = data.edges.value[edge_key]
    const edge_info_str:string = `${edge_info.name}${sep}${edge_info.dataSourceId}${sep}${edge_info.isMappingLabel}${sep}${edge_info.count}${sep}${edge_info.source}${sep}${edge_info.target}${sep}${JSON.stringify(edge_info.properties)}`
    edge_infos.push(edge_info_str)
  }
  const blob:Blob = new Blob([edge_infos.join("\n")], {type: 'plain/text'});
  saveAs(blob, "edges_infos.csv")
}
</script>

<template>
  <div class="w-full h-full">
    <div class="w-full h-[90%]">
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
   <div class="flex justify-center gap-12 h-[10%] items-center">
     <div class="flex gap-4 text-sm">
       <form class="bg-red-500">
         <input type="file" id="data_upload" @input="upload"/>
         <label for="data_upload">File upload</label>
       </form>
     </div>

     <button class="" @click="download">
       Download
     </button>
     <button @click="downloadNodesList">
       Nodes list
     </button>
     <button @click="downloadNodesDetailsList">
       Nodes list details
     </button>
     <button @click="downloadEdges">
      Edges list
     </button>
     <button @click="downloadEdgesDetailsList">
       Edges list details
     </button>
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