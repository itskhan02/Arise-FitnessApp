import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing';
import './components/Css/Style.css';
import Gender from './pages/Gender'; // <-- fix import path
import Goal from './pages/Goal';
import Equipment from './pages/Equipment';
import Level from './pages/Level';
import WorkoutDay from './pages/Schedule';
import Bodystats from './pages/Bodystats';
import Setup from './pages/Setup';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';


const App = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/gender" element={<Gender/>} />
          <Route path="/goal" element={<Goal/>} />
          <Route path="/equipment" element={<Equipment/>}/>
          <Route path='/level' element={<Level/>}/>
          <Route path='/bodystats' element={<Bodystats/>}/>
          <Route path="/workout-day" element={<WorkoutDay/>} />
          <Route path="/setup" element={<Setup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/reset-password" element={<ForgotPassword/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
