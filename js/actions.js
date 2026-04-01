// js/actions.js
import { getState, setState } from './state.js';

// ==========================================
// БЛОК 1: АВТОРИЗАЦІЯ ТА ПРОФІЛЬ
// ==========================================

export const registerUser = (name, email, password, gender, dob) => {
    const state = getState();
    
    // Перевіряємо, чи немає вже користувача з таким email
    const userExists = state.users.find(u => u.email === email);
    if (userExists) {
        alert("Користувач з таким email вже існує!");
        return false; // Повертаємо false, щоб форма знала про помилку
    }

    // Створюємо об'єкт нового користувача
    const newUser = {
        name, email, password, gender, dob,
        regDate: new Date().toLocaleDateString('uk-UA') // Автоматично беремо сьогоднішню дату
    };

    // Створюємо НОВИЙ масив: беремо всі старі дані (...state.users) і додаємо в кінець newUser
    const updatedUsers = [...state.users, newUser];
    
    // Зберігаємо новий масив у стан
    setState('users', updatedUsers);
    return true; // Успішна реєстрація
};

export const loginUser = (email, password) => {
    const state = getState();
    
    // Шукаємо користувача, у якого збігається і email, і пароль
    const user = state.users.find(u => u.email === email && u.password === password);

    if (user) {
        // Якщо знайшли, записуємо його email як активного користувача
        setState('currentUser', user.email);
        return true;
    } else {
        alert("Невірний email або пароль!");
        return false;
    }
};

export const logoutUser = () => {
    // Просто очищаємо активного користувача
    setState('currentUser', null);
};


// ==========================================
// БЛОК 2: КЕРУВАННЯ БУДИЛЬНИКАМИ
// ==========================================

export const addAlarm = (time, date) => {
    const state = getState();
    
    // Захист: якщо ніхто не залогінений, нічого не робимо
    if (!state.currentUser) return;

    const newAlarm = {
        id: Date.now(), // Генеруємо унікальний ID з поточного часу (в мілісекундах)
        ownerEmail: state.currentUser, // Прив'язуємо будильник до конкретної людини
        time: time,
        date: date,
        isActive: true // За замовчуванням новий будильник увімкнений
    };

    const updatedAlarms = [...state.alarms, newAlarm];
    setState('alarms', updatedAlarms);
};

export const toggleAlarm = (id) => {
    const state = getState();
    
    // map() проходить по всіх будильниках
    const updatedAlarms = state.alarms.map(alarm => {
        // Якщо знайшли той самий будильник, який клацнули
        if (alarm.id === Number(id)) {
            // Створюємо його копію, але перевертаємо значення isActive на протилежне (!true стає false)
            return { ...alarm, isActive: !alarm.isActive };
        }
        return alarm; // Інші будильники залишаємо без змін
    });

    setState('alarms', updatedAlarms);
};

export const deleteAlarm = (id) => {
    const state = getState();
    
    // filter() залишає в масиві ТІЛЬКИ ті будильники, id яких НЕ дорівнює видаленому
    const updatedAlarms = state.alarms.filter(alarm => alarm.id !== Number(id));
    
    setState('alarms', updatedAlarms);
};