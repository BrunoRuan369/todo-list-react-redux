import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Filter } from 'lucide-react';

// ============ REDUX IMPLEMENTATION ============

// Action Types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';
const EDIT_TODO = 'EDIT_TODO';
const SET_FILTER = 'SET_FILTER';

// Action Creators
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: {
    id: Date.now(),
    text,
    completed: false
  }
});

const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: id
});

const deleteTodo = (id) => ({
  type: DELETE_TODO,
  payload: id
});

const editTodo = (id, text) => ({
  type: EDIT_TODO,
  payload: { id, text }
});

const setFilter = (filter) => ({
  type: SET_FILTER,
  payload: filter
});

// Initial State
const initialState = {
  todos: [],
  filter: 'ALL'
};

// Reducer
const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    case EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        )
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };
    default:
      return state;
  }
};

// Redux Store Implementation
class ReduxStore {
  constructor(reducer, initialState) {
    this.reducer = reducer;
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

// Create Redux Store
const store = new ReduxStore(todoReducer, initialState);

// Redux Provider Component
const ReduxProvider = ({ children }) => {
  const [state, setState] = useState(store.getState());

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return unsubscribe;
  }, []);

  return (
    <ReduxContext.Provider value={{ state, dispatch: store.dispatch.bind(store) }}>
      {children}
    </ReduxContext.Provider>
  );
};

// Context para Redux
const ReduxContext = React.createContext();

// useSelector Hook (Redux)
const useSelector = (selector) => {
  const { state } = React.useContext(ReduxContext);
  return selector(state);
};

// useDispatch Hook (Redux)
const useDispatch = () => {
  const { dispatch } = React.useContext(ReduxContext);
  return dispatch;
};

// ============ REACT COMPONENTS ============

const TodoInput = () => {
  const [inputText, setInputText] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (inputText.trim()) {
      dispatch(addTodo(inputText.trim()));
      setInputText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Adicionar nova tarefa..."
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
      />
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 font-medium"
      >
        <Plus size={20} />
        Adicionar
      </button>
    </div>
  );
};

const TodoItem = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const dispatch = useDispatch();

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      dispatch(editTodo(todo.id, editText.trim()));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border transition-all duration-200 ${
      todo.completed ? 'bg-gray-50 border-gray-200' : 'border-gray-200 hover:shadow-md'
    }`}>
      <button
        onClick={() => dispatch(toggleTodo(todo.id))}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-500'
        }`}
      >
        {todo.completed && <Check size={16} />}
      </button>

      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleEdit}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            <Check size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <span className={`flex-1 ${
            todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
          }`}>
            {todo.text}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            disabled={todo.completed}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => dispatch(deleteTodo(todo.id))}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </>
      )}
    </div>
  );
};

const FilterButtons = () => {
  const filter = useSelector(state => state.filter);
  const dispatch = useDispatch();

  const filters = [
    { key: 'ALL', label: 'Todas' },
    { key: 'PENDING', label: 'Pendentes' },
    { key: 'COMPLETED', label: 'Concluídas' }
  ];

  return (
    <div className="flex gap-2 mb-6">
      <Filter size={20} className="text-gray-500 mt-2" />
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => dispatch(setFilter(key))}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            filter === key
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

const TodoList = () => {
  const { todos, filter } = useSelector(state => state);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'COMPLETED':
        return todo.completed;
      case 'PENDING':
        return !todo.completed;
      default:
        return true;
    }
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length
  };

  return (
    <div>
      <FilterButtons />
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-600">Total</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-yellow-600">Pendentes</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-green-600">Concluídas</div>
        </div>
      </div>

      {/* Todo Items */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-lg">
              {filter === 'ALL' 
                ? 'Nenhuma tarefa adicionada ainda'
                : filter === 'COMPLETED'
                ? 'Nenhuma tarefa concluída'
                : 'Nenhuma tarefa pendente'
              }
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ReduxProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              📋 Lista de Tarefas Redux
            </h1>
            <p className="text-gray-600">
              Gerenciamento de estado global com Redux
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <TodoInput />
            <TodoList />
          </div>

          {/* Redux Info */}
          <div className="mt-6 bg-white rounded-lg p-4 text-sm text-gray-600">
            <h3 className="font-semibold mb-2 text-green-600">✅ Redux Implementado:</h3>
            <ul className="space-y-1">
              <li>• <strong>Store:</strong> Classe ReduxStore com getState(), dispatch(), subscribe()</li>
              <li>• <strong>Actions:</strong> ADD_TODO, TOGGLE_TODO, DELETE_TODO, EDIT_TODO, SET_FILTER</li>
              <li>• <strong>Action Creators:</strong> addTodo(), toggleTodo(), deleteTodo(), editTodo(), setFilter()</li>
              <li>• <strong>Reducer:</strong> todoReducer com estado imutável</li>
              <li>• <strong>Hooks:</strong> useSelector() e useDispatch() implementados</li>
              <li>• <strong>Provider:</strong> ReduxProvider para conectar componentes</li>
            </ul>
          </div>
        </div>
      </div>
    </ReduxProvider>
  );
};

export default App;
