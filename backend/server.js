  const express = require('express');
  const cors = require('cors');                                                                                                                                          
  const Database = require('better-sqlite3');                     

  const app = express();
  const db = new Database('todos.db');

  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,                    
      done INTEGER NOT NULL DEFAULT 0,    
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )                                                                                                                                                                    
  `);
                                                                                                                                                                         
  app.use(cors());                                                
  app.use(express.json());

  app.get('/todos', (req, res) => {
    const todos = db.prepare('SELECT * FROM todos ORDER BY id DESC').all();
    res.json(todos);
  });

  app.post('/todos', (req, res) => {          
    const { title } = req.body;           
    if (!title) {
      return res.status(400).json({ error: 'title is required' });                                                                                                       
    }
    const result = db.prepare('INSERT INTO todos (title) VALUES (?)').run(title);                                                                                        
    const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newTodo);            
  });                                     
                                                                                                                                                                         
  app.patch('/todos/:id', (req, res) => {                                                                                                                                
    const id = Number(req.params.id);                                                                                                                                    
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);                                                                                                 
    if (!todo) {                                                  
      return res.status(404).json({ error: 'todo not found' });
    }
    const newDone = todo.done ? 0 : 1;
    db.prepare('UPDATE todos SET done = ? WHERE id = ?').run(newDone, id);
    const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.json(updated);
  });

  app.delete('/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    if (result.changes === 0) {           
      return res.status(404).json({ error: 'todo not found' });
    }                                                                                                                                                                    
    res.status(204).end();                
  });                                                                                                                                                                    
                                                                                                                                                                         
  const PORT = 3000;
  app.listen(PORT, () => {                                                                                                                                               
    console.log(`Backend running on http://localhost:${PORT}`);   
  });                        
