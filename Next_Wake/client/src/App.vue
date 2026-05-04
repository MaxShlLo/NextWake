<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark bg-success">
      <div class="container">
        <RouterLink class="navbar-brand" to="/">NextWake</RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/">Будильник</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/profile">Профіль</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/about">Про додаток</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/login">Вхід</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/register">Реєстрація</RouterLink></li>
          </ul>
        </div>
      </div>
    </nav>

    <RouterView />

    <footer class="bg-dark text-white text-center py-3 mt-auto border-top border-secondary">
      <div class="container">
        <p class="mb-0">&copy; 2026 NextWake. Просинайся вчасно.</p>
      </div>
    </footer>
  </div>
</template>