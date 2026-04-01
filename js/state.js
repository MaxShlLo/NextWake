// Імпортуємо наші функції для роботи з пам'яттю
import { loadData, saveData } from './storage.js';

// Це наш глобальний об'єкт стану. 
// Він одразу намагається завантажити дані з localStorage.
// Якщо там нічого немає, він використовує значення за замовчуванням (пусті масиви або null).
let state = {
    alarms: loadData('alarms', []),
    users: loadData('users', []),
    currentUser: loadData('currentUser', null)
};

/**
 * Функція для отримання копії поточного стану.
 * Інші файли (наприклад, view.js) будуть викликати її, щоб дізнатися, що малювати.
 */
export const getState = () => {
    return state;
};

/**
 * Єдина дозволена функція для зміни даних у стані.
 * Вона не тільки оновлює змінну, але й ОДРАЗУ зберігає нові дані в localStorage.
 * * @param {string} key - Що саме міняємо ('alarms', 'users', або 'currentUser')
 * @param {any} value - Нові дані
 */
export const setState = (key, value) => {
    // Оновлюємо дані в оперативній пам'яті
    state[key] = value;
    
    // Одразу "архівуємо" і зберігаємо в постійну пам'ять браузера
    saveData(key, value);
};