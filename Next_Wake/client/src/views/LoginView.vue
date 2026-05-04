<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

const loginUser = async () => {
  if (!email.value || !password.value) {
    alert('Введіть email та пароль!')
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user))
      
      alert('Вхід успішний!')
      router.push('/profile')
    } else {
      alert('Помилка: ' + data.error)
    }
  } catch (error) {
    console.error('Помилка з\'єднання:', error)
  }
}
</script>

<template>
  <main class="container my-5 flex-grow-1 d-flex justify-content-center align-items-center">
    <div class="border p-4 rounded w-100" style="max-width: 400px;">
      <h2 class="mb-4 text-center">Вхід до системи</h2>
      <form>
        <div class="mb-3">
          <label class="form-label">Електронна пошта</label>
          <input type="email" class="form-control" v-model="email" placeholder="name@example.com">
        </div>
        <div class="mb-4">
          <label class="form-label">Пароль</label>
          <input type="password" class="form-control" v-model="password" placeholder="Введіть пароль">
        </div>
        <button type="button" class="btn btn-success w-100" @click="loginUser">Увійти</button>
        <div class="text-center mt-3">
          <small>Немає акаунта? <RouterLink to="/register" class="text-success text-decoration-none">Зареєструватися</RouterLink></small>
        </div>
      </form>
    </div>
  </main>
</template>