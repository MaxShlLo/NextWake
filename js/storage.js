const PREFIX = 'nextwake_';

export const saveData = (key, data) => {
    try {
        const serializedData = JSON.stringify(data);
        // Зберігаємо в пам'ять браузера
        localStorage.setItem(PREFIX + key, serializedData);
    } catch (error) {
        console.error('Помилка збереження даних:', error);
    }
};

export const loadData = (key, defaultData = null) => {
    try {
        const serializedData = localStorage.getItem(PREFIX + key);
        
        if (serializedData === null) {
            return defaultData; 
        }
        
        return JSON.parse(serializedData);
    } catch (error) {
        console.error('Помилка читання даних:', error);
        return defaultData;
    }
};