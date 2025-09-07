import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing';
import './components/Css/Style.css';
import Gender from './pages/Gender'; // <-- fix import path
import Goal from './pages/Goal';
import Equipment from './pages/Equipment';


const App = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/gender" element={<Gender/>} />
          <Route path="/goal" element={<Goal/>} />
          <Route path="/equipment" element={<Equipment/>}/>
          {/* 
          <Route path="/gender" element={<Gender/>} />
          <Route path="/gender" element={<Gender/>} />
          <Route path="/gender" element={<Gender/>} /> 
          */}
        </Routes>
      </Router>
    </>
  )
}

export default App
