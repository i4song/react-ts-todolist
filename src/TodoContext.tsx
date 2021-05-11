import React, { useReducer, createContext, useContext, Dispatch } from 'react';

type Todo = {
  id: number;
  text: string;
  done: boolean;
}

type TodoState = Todo[];

type Action = 
  | { type: 'CREATE'; text: string; }
  | { type: 'TOGGLE'; id: number; }
  | { type: 'REMOVE'; id: number; };

type TodoDispatch = Dispatch<Action>;

const TodoStateContext = createContext<TodoState | null>(null);
const TodoDispatchContext = createContext<TodoDispatch | null>(null);

function todoReducer(state: TodoState, action: Action): TodoState {
  switch(action.type){
    case 'CREATE':
      const nextId = Math.max(...state.map(todo => todo.id)) + 1;
      return state.concat({
        id: nextId,
        text: action.text,
        done: false,
      })
    case 'TOGGLE':
      return state.map(todo => 
        todo.id === action.id ? {...todo, done: !todo.done} : todo
      );
    case 'REMOVE':
      return state.filter(todo => todo.id !== action.id);
    default:
      throw new Error('Unhandled action');
  }
}
export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, dispatch] = useReducer(todoReducer, [
    {
      id: 1,
      text: '프로젝트 생성하기',
      done: true
    },
    {
      id: 2,
      text: '컴포넌트 스타일링하기',
      done: true
    },
    {
      id: 3,
      text: 'Context 만들기',
      done: false
    },
    {
      id: 4,
      text: '기능 구현하기',
      done: false
    }
  ]);

  return (
    <TodoDispatchContext.Provider value={dispatch}>
      <TodoStateContext.Provider value={todos}>
        {children}
      </TodoStateContext.Provider>
    </TodoDispatchContext.Provider>
  );
}

export function useTodoState() {
  const context = useContext(TodoStateContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}

export function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}