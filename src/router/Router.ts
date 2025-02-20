import {createMemoryHistory, createRouter, Router} from 'vue-router'

import Graph from "../components/Graph.vue"

const routes = [
    { path: '/graph', component: Graph }
]

export const router:Router = createRouter({
    history: createMemoryHistory(),
    routes,
})