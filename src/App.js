import React, { createContext, useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import ListTodo from './components/ListTodo';
import { ModalReducer } from './reducer/ModalReducer';
import ModalTodo from './components/ModalTodo'

export const TodoContext = createContext()

function App() {
  const [modal, dispatchModal] = useReducer(ModalReducer, { visible: false, typeModal: '' })

  return (
    <TodoContext.Provider value={{ modal, dispatchModal }}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <ListTodo />
        <ModalTodo />
      </div>
    </TodoContext.Provider>
  );
}

export default App;
