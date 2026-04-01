
import { loadData, saveData } from './storage.js';

let state = {
    alarms: loadData('alarms', []),
    users: loadData('users', []),
    currentUser: loadData('currentUser', null)
};


export const getState = () => {
    return state;
};

export const setState = (key, value) => {

    state[key] = value;

    saveData(key, value);
};