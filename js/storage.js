// Константа-префікс, щоб наші ключі не переплуталися з іншими сайтами
const PREFIX = 'nextwake_';

/**
 * Зберігає дані у localStorage, автоматично перетворюючи їх у JSON (текст)
 * @param {string} key - Назва "шухляди" (наприклад, 'alarms')
 * @param {any} data - Дані для збереження (масив або об'єкт)
 */
export const saveData = (key, data) => {
    try {
        // Перетворюємо масив/об'єкт у текстовий формат JSON
        const serializedData = JSON.stringify(data);
        // Зберігаємо в пам'ять браузера
        localStorage.setItem(PREFIX + key, serializedData);
    } catch (error) {
        // Якщо щось піде не так (наприклад, пам'ять переповнена)
        console.error('Помилка збереження даних:', error);
    }
};

/**
 * Дістає дані з localStorage і перетворює їх назад у масив/об'єкт
 * @param {string} key - Назва "шухляди"
 * @param {any} defaultData - Що повернути, якщо даних ще немає (наприклад, порожній масив [])
 */
export const loadData = (key, defaultData = null) => {
    try {
        // Дістаємо текст із пам'яті
        const serializedData = localStorage.getItem(PREFIX + key);
        
        // Якщо за цим ключем нічого немає (користувач зайшов вперше)
        if (serializedData === null) {
            return defaultData; 
        }
        
        // Розпаковуємо текст назад у структуру JavaScript
        return JSON.parse(serializedData);
    } catch (error) {
        console.error('Помилка читання даних:', error);
        return defaultData;
    }
};