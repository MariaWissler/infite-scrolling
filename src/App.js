import React from 'react';
import CardComponent from './Cards';
import './App.css';

const App = () => (
<div>
<div className="header">
     <h1 className="title">Magic the Gathering: Creatures</h1>
     </div>
    <div className="row">
       <CardComponent />
      </div>
      </div> 
);

export default App;
