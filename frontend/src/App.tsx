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
                                                                                                                                                                         
    return (                                                      
      <div className="container">         
        <h1>Todos</h1>
        {error && <p className="error">{error}</p>}                                                                                                                      
        <form onSubmit={(e) => { e.preventDefault(); addTodo(); }}>
          <input                                                                                                                                                         
            type="text"                                           
            placeholder="What needs doing?"
            value={title}                                                                                                                                                
            onChange={(e) => setTitle(e.target.value)}
          />                                                                                                                                                             
          <button type="submit">Add</button>                      
        </form>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className={todo.done ? 'done' : ''}>
              <span onClick={() => toggleDone(todo.id)}>{todo.title}</span>
              <button onClick={() => deleteTodo(todo.id)}>×</button>
            </li>
          ))}                                                                                                                                                            
        </ul>                             
      </div>                                                                                                                                                             
    );                                                                                                                                                                   
  }
                                                                                                                                                                         
  export default App;                
