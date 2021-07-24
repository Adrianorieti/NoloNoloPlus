import React from 'react';
import './App.css';
import Prova  from './funzione-prova';

function App() {
  return (
    <section className="App">
      <div className="container">
       <div className="insert">
          <input type="text" placeholder="Inserisci un brano" />

            <Prova />   

       </div>
      </div>
    </section>
  );
}

export default App;
