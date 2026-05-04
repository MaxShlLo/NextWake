<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref(null)
const isEditing = ref(false)
const editForm = ref({})

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
})

// Редагувати
const startEditing = () => {
  editForm.value = { ...user.value }
  isEditing.value = true
}

// Скасувати
const cancelEditing = () => {
  isEditing.value = false
}

const saveProfile = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${user.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm.value)
    })
    
    if (response.ok) {
      user.value = { ...editForm.value }
      localStorage.setItem('user', JSON.stringify(user.value))
      isEditing.value = false
      alert('Дані успішно оновлено!')
    } else {
      const data = await response.json()
      alert('Помилка: ' + data.error)
    }
  } catch (error) {
    console.error('Помилка збереження:', error)
  }
}

const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  router.push('/login')
}
</script>

<template>
  <main class="container my-5 flex-grow-1">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h2 class="mb-4 text-center">Ваш профіль</h2>
        <div class="border p-4 rounded bg-dark text-white shadow">

          <div v-if="user">
            <div v-if="!isEditing">
              <table class="table table-dark table-striped table-bordered mt-3">
                <tbody>
                  <tr>
                    <th style="width: 30%" class="text-secondary">Ім'я:</th>
                    <td class="fs-5">{{ user.name }}</td>
                  </tr>
                  <tr>
                    <th class="text-secondary">Email:</th>
                    <td class="fs-5">{{ user.email }}</td>
                  </tr>
                  <tr>
                    <th class="text-secondary">Стать:</th>
                    <td class="fs-5">{{ user.gender === 'male' ? 'Чоловіча' : 'Жіноча' }}</td>
                  </tr>
                  <tr>
                    <th class="text-secondary">Дата народження:</th>
                    <td class="fs-5">{{ user.dob }}</td>
                  </tr>
                </tbody>
              </table>
              
              <div class="text-center mt-4">
                <button type="button" class="btn btn-outline-success" @click="startEditing">Редагувати дані</button>
                <button type="button" class="btn btn-outline-danger ms-2" @click="logout">Вийти з акаунта</button>
              </div>
            </div>

            <div v-else>
              <h4 class="text-success mb-3 text-center">Редагування даних</h4>
              <form @submit.prevent="saveProfile">
                <div class="mb-3">
                  <label class="form-label">Ім'я</label>
                  <input type="text" class="form-control bg-dark text-white border-secondary" v-model="editForm.name" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control bg-dark text-white border-secondary" v-model="editForm.email" required>
                </div>
                <div class="mb-3">
                  <label class="form-label d-block">Стать</label>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="male" v-model="editForm.gender">
                    <label class="form-check-label">Чоловіча</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="female" v-model="editForm.gender">
                    <label class="form-check-label">Жіноча</label>
                  </div>
                </div>
                <div class="mb-4">
                  <label class="form-label">Дата народження</label>
                  <input type="date" class="form-control bg-dark text-white border-secondary date-input" v-model="editForm.dob" required>
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-success px-4">Зберегти</button>
                  <button type="button" class="btn btn-secondary ms-2 px-4" @click="cancelEditing">Скасувати</button>
                </div>
              </form>
            </div>

          </div>

          <div v-else class="text-center py-5">
            <h4 class="text-secondary mb-4">Ви не авторизовані</h4>
            <RouterLink to="/login" class="btn btn-success btn-lg">Увійти в акаунт</RouterLink>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>