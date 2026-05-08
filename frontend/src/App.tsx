import { useEffect, useState } from 'react';
import './App.css';

type Todo = {
  id: number;
  title: string;
  done: number;
  created_at: string;
};

const API = 'http://localhost:3000';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const loadTodos = async () => {
    try {
      const res = await fetch(`${API}/todos`);
      const data = await res.json();
      setTodos(data);
      setError('');
    } catch {
      setError('Could not reach the backend. Is it running on port 3000?');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTodos();
  }, []);

  const addTodo = async () => {
    if (!title.trim()) return;
    await fetch(`${API}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    loadTodos();
  };

  const toggleDone = async (id: number) => {
    await fetch(`${API}/todos/${id}`, { method: 'PATCH' });
    loadTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch(`${API}/todos/${id}`, { method: 'DELETE' });
    loadTodos();
  };

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="page">
      <main className="card">
        <header className="card-header">
          <h1>Todos</h1>
          <p className="subtitle">
            {todos.length === 0
              ? 'Nothing here yet — add your first task'
              : `${remaining} remaining of ${todos.length}`}
          </p>
        </header>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
        >
          <input
            className="input"
            type="text"
            placeholder="What needs doing?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="New todo"
          />
          <button className="add-button" type="submit">
            Add
          </button>
        </form>

        {todos.length > 0 && (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.done ? 'done' : ''}`}
              >
                <button
                  type="button"
                  className="checkbox"
                  onClick={() => toggleDone(todo.id)}
                  aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
                  aria-pressed={!!todo.done}
                >
                  {todo.done ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </button>
                <span className="todo-title">{todo.title}</span>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Delete ${todo.title}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
