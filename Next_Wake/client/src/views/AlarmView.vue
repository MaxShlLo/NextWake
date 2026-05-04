<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const alarms = ref([]) 
const newAlarmDate = ref('')
const newAlarmTime = ref('')
let timerId = null

const ringtone = new Audio('/al.mp3') 
ringtone.loop = true

const user = ref(null)

const fetchAlarms = async () => {
  if (!user.value) return;
  
  try {
    const response = await fetch(`http://localhost:3000/api/alarms/${user.value.id}`)
    alarms.value = await response.json()
  } catch (error) {
    console.error('Помилка завантаження:', error)
  }
}

const addAlarm = async () => {
  if (!user.value) {
    alert('Будь ласка, увійдіть в акаунт, щоб додати будильник!')
    return
  }

  if (newAlarmDate.value && newAlarmTime.value) {
    const newAlarm = {
      userId: user.value.id,
      date: newAlarmDate.value,
      time: newAlarmTime.value,
      isActive: true
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/alarms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlarm)
      })
      const savedAlarm = await response.json()
      alarms.value.push(savedAlarm) 
      
      newAlarmDate.value = '' 
      newAlarmTime.value = '' 
    } catch (error) {
      console.error('Помилка збереження:', error)
    }
  } else {
    alert('Будь ласка, заповніть і дату, і час!');
  }
}

const deleteAlarm = async (id) => {
  try {
    await fetch(`http://localhost:3000/api/alarms/${id}`, { method: 'DELETE' })
    alarms.value = alarms.value.filter(alarm => alarm.id !== id)
  } catch (error) {
    console.error('Помилка видалення:', error)
  }
}

const formatDisplayDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
}

const checkAlarms = () => {
  const now = new Date()
  const currentDate = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0')
  const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')

  alarms.value.forEach(alarm => {
    if (alarm.isActive && alarm.date === currentDate && alarm.time === currentTime && now.getSeconds() === 0) {
      const modalElement = document.getElementById('alarmModal')
      document.getElementById('modalAlarmTime').innerText = alarm.time
      const bsModal = new bootstrap.Modal(modalElement)
      bsModal.show()

      ringtone.play().catch(error => console.log("Браузер заблокував звук:", error))
      alarm.isActive = false 
    }
  })
}

const stopRinging = () => {
  ringtone.pause()
  ringtone.currentTime = 0
}

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
    fetchAlarms()
  }

  timerId = setInterval(checkAlarms, 1000)
  const modalElement = document.getElementById('alarmModal')
  if(modalElement) {
    modalElement.addEventListener('hidden.bs.modal', stopRinging)
  }
})

onUnmounted(() => {
  clearInterval(timerId)
})
</script>

<template>
  <main class="container my-5 flex-grow-1">
    <h2 class="mb-5 text-center">Керування будильниками</h2>

    <div v-if="user">
      <div class="border p-3 rounded">
        <h4>Створити будильник</h4>
        <form>
          <div class="mb-3">
            <label class="form-label">Дата спрацювання:</label>
            <input type="date" class="form-control" v-model="newAlarmDate">
          </div>
          <div class="mb-3">
            <label class="form-label">Час спрацювання:</label>
            <input type="time" class="form-control" v-model="newAlarmTime">
          </div>
          <button type="button" class="btn btn-success" @click="addAlarm">Зберегти будильник</button>
        </form>
      </div>

      <div class="border p-3 rounded mt-4">
        <h4>Ваші будильники</h4>
        <div id="alarmsList">
          <div v-if="alarms.length === 0" class="alert alert-secondary text-center" role="alert">
            У вас поки що немає заведених будильників.
          </div>
          <div v-else>
            <div v-for="alarm in alarms" :key="alarm.id" class="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <strong>{{ formatDisplayDate(alarm.date) }}</strong> о <strong>{{ alarm.time }}</strong>
              </div>
              <div class="d-flex align-items-center">
                <div class="form-check form-switch me-3 mb-0">
                  <input class="form-check-input bg-success border-success mt-0" type="checkbox" role="switch" v-model="alarm.isActive">
                </div>
                <button class="btn btn-danger btn-sm" @click="deleteAlarm(alarm.id)">Видалити</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5 border rounded bg-dark">
      <h4 class="text-secondary mb-4">Щоб створювати будильники, потрібно увійти в систему.</h4>
      <RouterLink to="/login" class="btn btn-success btn-lg">Увійти в акаунт</RouterLink>
    </div>
  </main>

  <div class="modal fade" id="alarmModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-dark text-white border-success">
        <div class="modal-header border-secondary">
          <h5 class="modal-title text-success">⏰ БУДИЛЬНИК!</h5>
        </div>
        <div class="modal-body text-center py-4">
          <h1 class="display-1 text-success fw-bold" id="modalAlarmTime">00:00</h1>
          <p class="lead mt-3" id="modalAlarmMessage">Просинайся!</p>
        </div>
        <div class="modal-footer border-secondary justify-content-center">
          <button type="button" class="btn btn-success btn-lg w-50" data-bs-dismiss="modal">Я ПРОКИНУВСЯ!</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="time"]::-webkit-calendar-picker-indicator,
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  position: absolute;
  left: 10px;
  cursor: pointer;
}

input[type="time"],
input[type="date"] {
  position: relative;
  padding-left: 45px;
}
</style>