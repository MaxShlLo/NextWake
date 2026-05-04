const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 1. БАЗА ДАНИХ
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error(err.message);
    console.log('Підключено до бази даних SQLite.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS alarms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        date TEXT,
        time TEXT,
        isActive INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        gender TEXT,
        dob TEXT
    )`);
});


// 2. БУДИЛЬНИКИ
app.get('/api/alarms/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all('SELECT * FROM alarms WHERE user_id = ?', [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const formattedRows = rows.map(row => ({
            ...row,
            isActive: row.isActive === 1
        }));
        res.json(formattedRows);
    });
});

app.post('/api/alarms', (req, res) => {
    const { userId, date, time, isActive } = req.body;
    const activeInt = isActive ? 1 : 0;
    
    db.run('INSERT INTO alarms (user_id, date, time, isActive) VALUES (?, ?, ?, ?)', 
        [userId, date, time, activeInt], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, user_id: userId, date, time, isActive });
        }
    );
});

app.delete('/api/alarms/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM alarms WHERE id = ?', id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Видалено успішно' });
    });
});


// 3. КОРИСТУВАЧІ
app.post('/api/register', (req, res) => {
    const { name, email, password, gender, dob } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (row) {
            return res.status(400).json({ error: 'Користувач з таким email вже існує!' });
        }

        db.run('INSERT INTO users (name, email, password, gender, dob) VALUES (?, ?, ?, ?, ?)', 
            [name, email, password, gender, dob], 
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Реєстрація успішна!', userId: this.lastID });
            }
        );
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get('SELECT id, name, email, gender, dob FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (row) {
            res.json({ message: 'Вхід успішний!', user: row });
        } else {
            res.status(401).json({ error: 'Неправильний email або пароль' });
        }
    });
});

// 4. РЕДАГУВАННЯ ПРОФІЛЮ
app.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, gender, dob } = req.body; 
    
    db.run(
        'UPDATE users SET name = ?, email = ?, gender = ?, dob = ? WHERE id = ?',
        [name, email, gender, dob, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Дані оновлено успішно!' });
        }
    );
});

// 5. ЗАПУСК
app.listen(port, () => {
    console.log(`Сервер працює на адресі http://localhost:${port}`);
});