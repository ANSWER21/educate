<template>
  <div class="full-screen">
    <router-view/>
  </div>
</template>

<style>
.full-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  margin: 0;
  background-color: #282c34;
  color: white;
  font-size: 24px;
  text-align: center;
}
</style>

<script setup lang="ts">
</script>