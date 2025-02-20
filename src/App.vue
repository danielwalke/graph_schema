<script setup lang="ts">
import {onMounted} from "vue";
import {useRouter} from "vue-router";


const router = useRouter()
onMounted(()=>{
  router.push("/graph")
})
</script>

<template>
  <div class="w-screen h-screen border-gray-200 border-4">
    <RouterView />

  </div>
</template>

<style scoped>
</style>
