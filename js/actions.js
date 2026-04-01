import { getState, setState } from './state.js';

// БЛОК 1: АВТОРИЗАЦІЯ ТА ПРОФІЛЬ

export const registerUser = (name, email, password, gender, dob) => {
    const state = getState();
    
    const userExists = state.users.find(u => u.email === email);
    if (userExists) {
        alert("Користувач з таким email вже існує!");
        return false;
    }

    const newUser = {
        name, email, password, gender, dob,
        regDate: new Date().toLocaleDateString('uk-UA')
    };

    const updatedUsers = [...state.users, newUser];
    
    setState('users', updatedUsers);
    return true;
};

export const loginUser = (email, password) => {
    const state = getState();
    
    const user = state.users.find(u => u.email === email && u.password === password);

    if (user) {
        setState('currentUser', user.email);
        return true;
    } else {
        alert("Невірний email або пароль!");
        return false;
    }
};

export const logoutUser = () => {
    setState('currentUser', null);
};



// БЛОК 2: КЕРУВАННЯ БУДИЛЬНИКАМИ

export const addAlarm = (time, date) => {
    const state = getState();
    
    if (!state.currentUser) return;

    const newAlarm = {
        id: Date.now(),
        ownerEmail: state.currentUser,
        time: time,
        date: date,
        isActive: true
    };

    const updatedAlarms = [...state.alarms, newAlarm];
    setState('alarms', updatedAlarms);
};

export const toggleAlarm = (id) => {
    const state = getState();

    const updatedAlarms = state.alarms.map(alarm => {
        if (alarm.id === Number(id)) {
            return { ...alarm, isActive: !alarm.isActive };
        }
        return alarm;
    });

    setState('alarms', updatedAlarms);
};

export const deleteAlarm = (id) => {
    const state = getState();
    
    const updatedAlarms = state.alarms.filter(alarm => alarm.id !== Number(id));
    
    setState('alarms', updatedAlarms);
};