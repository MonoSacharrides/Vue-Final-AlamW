<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-primary p-3" id="navbar">
    <div class="container-lg">
      <RouterLink class="navbar-brand" to="/" style="margin-left: 5px; color:white;">IT Department Task Board</RouterLink>
    </div>
    <div class="navbar-collapse ms-5" id="navbarNav">
  <ul class="navbar-nav">
    <li class="nav-item">
      <RouterLink
        class="nav-link btn btn-light me-2 px-3 py-2 rounded-pill"
        aria-current="page"
        to="/">
        Home
      </RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink
        class="nav-link btn btn-light me-2 px-3 py-2 rounded-pill"
        to="/employees">
        Employees
      </RouterLink>
    </li>
  </ul>
</div>

  </nav>

<RouterView />
</template>

<style scoped>


</style>
