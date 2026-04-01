// js/main.js

// Імпортуємо всі наші інструменти з інших модулів
import { registerUser, loginUser, logoutUser, addAlarm, toggleAlarm, deleteAlarm } from './actions.js';
import { renderAlarms, renderProfile } from './view.js';
import { getState } from './state.js';

// Чекаємо, поки весь HTML повністю завантажиться
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. СТОРІНКА БУДИЛЬНИКА (index.html)
    // ==========================================
    const addAlarmBtn = document.getElementById('btnAddAlarm');
    const alarmsContainer = document.getElementById('alarmsList');

    if (addAlarmBtn && alarmsContainer) {
        // Одразу малюємо будильники при завантаженні сторінки
        renderAlarms();

        // Слухаємо кнопку "Зберегти будильник"
        addAlarmBtn.addEventListener('click', () => {
            const dateInput = document.getElementById('alarmDate').value;
            const timeInput = document.getElementById('alarmTime').value;

            if (!timeInput) {
                alert('Будь ласка, оберіть час спрацювання!');
                return;
            }

            // ДІЯ -> СТАН -> ПЕРЕМАЛЬОВКА (Ось він, Unidirectional data flow!)
            addAlarm(timeInput, dateInput);
            renderAlarms(); 
        });

        // 🏆 МАГІЯ: Event Delegation (Делегування подій) 🏆
        // Замість того, щоб вішати слухач на кожну кнопку "Видалити", ми вішаємо 
        // ОДИН слухач на весь великий контейнер зі списком.
        alarmsContainer.addEventListener('click', (event) => {
            const target = event.target; // Елемент, по якому реально клікнули
            
            // Читаємо атрибути data-action та data-id, які ми прописали у view.js
            const action = target.dataset.action;
            const id = target.dataset.id;

            if (action === 'delete') {
                deleteAlarm(id);  // Змінюємо стан
                renderAlarms();   // Перемальовуємо
            } else if (action === 'toggle') {
                toggleAlarm(id);  // Змінюємо стан
                renderAlarms();   // Перемальовуємо
            }
        });
    }

    // ==========================================
    // 2. СТОРІНКА РЕЄСТРАЦІЇ (register.html)
    // ==========================================
    const registerBtn = document.getElementById('btnRegister');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            // У тебе в HTML немає поля ID для пароля на реєстрації, припустимо ти додаси id="regPassword"
            const password = document.getElementById('regPassword')?.value || "1234"; 
            const dob = document.getElementById('regDob').value;
            
            // Шукаємо, яка саме радіокнопка статі зараз обрана
            const genderNode = document.querySelector('input[name="genderOptions"]:checked');
            const gender = genderNode ? genderNode.value : 'male';

            if (!name || !email) {
                alert('Будь ласка, заповніть ім\'я та email!');
                return;
            }

            const isSuccess = registerUser(name, email, password, gender, dob);
            if (isSuccess) {
                alert('Реєстрація успішна! Тепер увійдіть в систему.');
                window.location.href = 'login.html'; // Перекидаємо на сторінку входу
            }
        });
    }

    // ==========================================
    // 3. СТОРІНКА ВХОДУ (login.html)
    // ==========================================
    const loginBtn = document.getElementById('btnLogin');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                alert('Будь ласка, введіть email та пароль!');
                return;
            }

            const isSuccess = loginUser(email, password);
            if (isSuccess) {
                window.location.href = 'index.html'; // Перекидаємо до будильників
            }
        });
    }

    // ==========================================
    // 4. СТОРІНКА ПРОФІЛЮ (profile.html)
    // ==========================================
    const profileTable = document.getElementById('profileTableBody');
    const logoutBtn = document.getElementById('btnLogout');

    if (profileTable) {
        renderProfile(); // Малюємо таблицю даними поточного юзера

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                logoutUser();
                window.location.href = 'login.html'; // Виходимо і кидаємо на вхід
            });
        }
    }


    // ==========================================
    // 5. ДВИГУН БУДИЛЬНИКА (Polling)
    // ==========================================
    // setInterval запускає цю функцію кожну 1000 мілісекунд (1 секунду)
    setInterval(() => {
        const state = getState();
        // Якщо ніхто не залогінений, або немає будильників - виходимо
        if (!state.currentUser || state.alarms.length === 0) return;

        const now = new Date();
        
        // Отримуємо поточний час у форматі "ГГ:ХХ"
        const currentTime = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
        
        // Отримуємо поточну локальну дату у форматі "РРРР-ММ-ДД" (як у input type="date")
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        // Шукаємо будильники, яким час дзвонити
        const alarmsToRing = state.alarms.filter(alarm => {
            // Перевіряємо: чи мій це будильник + чи він увімкнений + чи збігається час
            if (alarm.ownerEmail === state.currentUser && alarm.isActive && alarm.time === currentTime) {
                // Якщо дата порожня (щодня) АБО дата збігається з сьогоднішньою
                if (!alarm.date || alarm.date === currentDate) {
                    return true;
                }
            }
            return false;
        });

        // Якщо такі будильники знайшлися
        alarmsToRing.forEach(alarm => {
            // 1. Вимикаємо його, щоб не дзвонив кожну секунду протягом хвилини
            toggleAlarm(alarm.id); 
            
            // 2. Одразу перемальовуємо інтерфейс (перемикач стане сірим)
            if (document.getElementById('alarmsList')) {
                renderAlarms(); 
            }
            
            // 3. 🔊 ЗАПУСКАЄМО МУЗИКУ!
            // Вкажи тут точну назву свого файлу
            const ringtone = new Audio('al.mp3'); 
            
            // Робимо так, щоб музика грала по колу (опціонально)
            ringtone.loop = true; 
            
            // Команда play() запускає звук
            ringtone.play().then(() => {
                // Маленький трюк: чекаємо 100 мілісекунд, щоб звук 100% почав грати,
                // і тільки тоді показуємо вікно, яке "заморозить" сторінку
                setTimeout(() => {
                    alert(`⏰ БУДИЛЬНИК!\nЧас: ${alarm.time}\nПросинайся!`);
                    
                    // Як тільки користувач натисне "ОК" на alert, код піде далі:
                    ringtone.pause(); // Вимикаємо звук
                }, 100);
            }).catch(error => {
                // Захист: сучасні браузери блокують звук, якщо користувач не клікав по сторінці
                console.log("Браузер заблокував звук:", error);
                alert(`⏰ БУДИЛЬНИК (Без звуку)!\nЧас: ${alarm.time}\nПросинайся!`);
            });
        });

    }, 1000);


});

