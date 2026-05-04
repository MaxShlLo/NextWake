<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const gender = ref('')
const dob = ref('')

const registerUser = async () => {

  if (!name.value || !email.value || !password.value || !dob.value) {
    alert('Будь ласка, заповніть всі поля!')
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        gender: gender.value,
        dob: dob.value
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      alert('Реєстрація успішна! Тепер увійдіть у свій акаунт.')
      router.push('/login') // Автоматично переходимо на сторінку входу
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
    <div class="border p-4 rounded w-100" style="max-width: 500px;">
      <h2 class="mb-4 text-center">Створення акаунта</h2>
      <form>
        <div class="mb-3">
          <label class="form-label">Ім'я</label>
          <input type="text" class="form-control" v-model="name" placeholder="Введіть ваше ім'я">
        </div>
        <div class="mb-3">
          <label class="form-label">Електронна пошта</label>
          <input type="email" class="form-control" v-model="email" placeholder="name@example.com">
        </div>
        <div class="mb-3">
          <label class="form-label">Пароль</label>
          <input type="password" class="form-control" v-model="password" placeholder="Створіть пароль">
        </div>
        <div class="mb-3">
          <label class="form-label d-block">Стать</label>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" value="male" v-model="gender">
            <label class="form-check-label">Чоловіча</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" value="female" v-model="gender">
            <label class="form-check-label">Жіноча</label>
          </div>
        </div>
        <div class="mb-4">
          <label class="form-label">Дата народження</label>
          <input type="date" class="form-control" v-model="dob">
        </div>
        <button type="button" class="btn btn-success w-100" @click="registerUser">Зареєструватися</button>
        <div class="text-center mt-3">
          <small>Вже є акаунт? <RouterLink to="/login" class="text-success text-decoration-none">Увійти</RouterLink></small>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>