// js/view.js
import { getState } from './state.js';

/**
 * Функція для малювання списку будильників на головній сторінці
 */
export const renderAlarms = () => {
    // Шукаємо на сторінці місце, куди будемо вставляти будильники
    const alarmsContainer = document.getElementById('alarmsList');
    
    // Якщо такого елемента немає (наприклад, ми на сторінці Входу), просто виходимо
    if (!alarmsContainer) return;

    const state = getState();
    
    // Фільтруємо будильники: беремо ТІЛЬКИ ті, що належать поточному користувачу
    const userAlarms = state.alarms.filter(alarm => alarm.ownerEmail === state.currentUser);

    // Якщо будильників немає, показуємо заглушку (Alert)
    if (userAlarms.length === 0) {
        alarmsContainer.innerHTML = `
            <div class="alert alert-secondary text-center" role="alert">
                У вас поки що немає заведених будильників. Заповніть форму вище, щоб додати перший.
            </div>
        `;
        return;
    }

    // Перетворюємо масив об'єктів на один великий рядок HTML-коду
    const alarmsHTML = userAlarms.map(alarm => {
        // Якщо будильник увімкнено - колір тексту зелений, якщо вимкнено - сірий
        const timeColorClass = alarm.isActive ? 'text-success' : 'text-secondary';
        const dateText = alarm.date ? alarm.date : 'Щодня';
        
        return `
            <div class="list-group-item d-flex justify-content-between align-items-center p-3 mb-2 rounded border border-secondary bg-dark text-white">
                <div>
                    <h3 class="mb-0 ${timeColorClass}">${alarm.time}</h3>
                    <small class="text-muted">${dateText}</small>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="form-check form-switch fs-3 mb-0">
                        <input class="form-check-input bg-success" type="checkbox" role="switch" 
                               data-action="toggle" data-id="${alarm.id}" 
                               ${alarm.isActive ? 'checked' : ''}>
                    </div>
                    <button class="btn btn-outline-danger btn-sm" 
                            data-action="delete" data-id="${alarm.id}">
                        Видалити
                    </button>
                </div>
            </div>
        `;
    }).join(''); // Зшиваємо всі шматочки масиву в один суцільний текст

    // Вставляємо готовий HTML на сторінку
    alarmsContainer.innerHTML = `<div class="list-group">${alarmsHTML}</div>`;
};


/**
 * Функція для малювання даних користувача на сторінці Профілю
 */
export const renderProfile = () => {
    const profileContainer = document.getElementById('profileTableBody');
    if (!profileContainer) return;

    const state = getState();
    const user = state.users.find(u => u.email === state.currentUser);

    if (!user) return;

    // Заповнюємо таблицю даними
    profileContainer.innerHTML = `
        <tr><th scope="row" style="width: 40%;">Ім'я:</th><td>${user.name}</td></tr>
        <tr><th scope="row">Email:</th><td>${user.email}</td></tr>
        <tr><th scope="row">Стать:</th><td>${user.gender === 'male' ? 'Чоловіча' : 'Жіноча'}</td></tr>
        <tr><th scope="row">Дата народження:</th><td>${user.dob}</td></tr>
        <tr><th scope="row">Дата реєстрації:</th><td>${user.regDate}</td></tr>
    `;
};