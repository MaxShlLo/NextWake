
import { registerUser, loginUser, logoutUser, addAlarm, toggleAlarm, deleteAlarm } from './actions.js';
import { renderAlarms, renderProfile } from './view.js';
import { getState } from './state.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. СТОРІНКА БУДИЛЬНИКА (index.html)
    const addAlarmBtn = document.getElementById('btnAddAlarm');
    const alarmsContainer = document.getElementById('alarmsList');

    if (addAlarmBtn && alarmsContainer) {
        renderAlarms();

        // Слухаємо кнопку "Зберегти будильник"
        addAlarmBtn.addEventListener('click', () => {
            const dateInput = document.getElementById('alarmDate').value;
            const timeInput = document.getElementById('alarmTime').value;

            if (!timeInput) {
                alert('Будь ласка, оберіть час спрацювання!');
                return;
            }

            addAlarm(timeInput, dateInput);
            renderAlarms(); 
        });

        alarmsContainer.addEventListener('click', (event) => {
            const target = event.target;
            
            const action = target.dataset.action;
            const id = target.dataset.id;

            if (action === 'delete') {
                deleteAlarm(id);
                renderAlarms();
            } else if (action === 'toggle') {
                toggleAlarm(id);
                renderAlarms(); 
            }
        });
    }

    // 2. СТОРІНКА РЕЄСТРАЦІЇ (register.html)
    const registerBtn = document.getElementById('btnRegister');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword')?.value || "1234"; 
            const dob = document.getElementById('regDob').value;

            const genderNode = document.querySelector('input[name="genderOptions"]:checked');
            const gender = genderNode ? genderNode.value : 'male';

            if (!name || !email) {
                alert('Будь ласка, заповніть ім\'я та email!');
                return;
            }

            const isSuccess = registerUser(name, email, password, gender, dob);
            if (isSuccess) {
                alert('Реєстрація успішна! Тепер увійдіть в систему.');
                window.location.href = 'login.html';
            }
        });
    }

    // 3. СТОРІНКА ВХОДУ (login.html)
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
                window.location.href = 'index.html';
            }
        });
    }

    // 4. СТОРІНКА ПРОФІЛЮ (profile.html)
    const profileTable = document.getElementById('profileTableBody');
    const logoutBtn = document.getElementById('btnLogout');

    if (profileTable) {
        renderProfile();

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                logoutUser();
                window.location.href = 'login.html';
            });
        }
    }


    // 5. БУДИЛЬНИК

    setInterval(() => {
        const state = getState();
        if (!state.currentUser || state.alarms.length === 0) return;

        const now = new Date();
        
        const currentTime = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        const alarmsToRing = state.alarms.filter(alarm => {
            if (alarm.ownerEmail === state.currentUser && alarm.isActive && alarm.time === currentTime) {
                if (!alarm.date || alarm.date === currentDate) {
                    return true;
                }
            }
            return false;
        });

        alarmsToRing.forEach(alarm => {
            toggleAlarm(alarm.id); 
            
            if (document.getElementById('alarmsList')) {
                renderAlarms(); 
            }
            
            const ringtone = new Audio('al.mp3'); 
            
            ringtone.loop = true; 
            
            ringtone.play().then(() => {
                setTimeout(() => {
                    alert(`БУДИЛЬНИК!\nЧас: ${alarm.time}\nПросинайся!`);
                    
                    ringtone.pause();
                }, 120000 );
            }).catch(error => {
                console.log("Браузер заблокував звук:", error);
                alert(`БУДИЛЬНИК (Без звуку)!\nЧас: ${alarm.time}\nПросинайся!`);
            });
        });

    }, 1000);


});

