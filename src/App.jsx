import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import './components/Css/Style.css';
import Gender from './pages/Gender'; 
import Goal from './pages/Goal';
import Equipment from './pages/Equipment';
import Difficulty from './pages/Difficulty';
import Schedule from './pages/Schedule';
import Bodystats from './pages/Bodystats';
import Setup from './pages/Setup';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Focusarea from './pages/FocusArea';
import Weight from './pages/Weight';
import GoalWeight from './pages/GoalWeight';
import Age from './pages/Age';
import Height from './pages/Height';
import Exercises from './pages/Exercises';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import ExerciseVideo from './pages/ExerciseVideo';

const App = () => {
  // safe useAuth: if Clerk provider isn't mounted, the hook can throw — catch and provide safe fallbacks
  let getToken = async () => null;
  let isSignedIn = false;
  try {
    const auth = useAuth();
    getToken = auth.getToken;
    isSignedIn = auth.isSignedIn;
  } catch (err) {
    console.warn("useAuth unavailable (Clerk provider missing?)", err);
  }
  // small mount log to help diagnose blank screen
  console.log("App mounted. isSignedIn:", isSignedIn);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={isSignedIn ? <Navigate to="/home" /> : <Landing />} />
          <Route path="/gender" element={<Gender/>} />
          <Route path="/goal" element={<Goal/>} />
          <Route path="/focusarea" element={<Focusarea/>} />
          <Route path="/equipment" element={<Equipment/>}/>
          <Route path='/difficulty-level' element={<Difficulty/>}/>
          <Route path='/bodystats' element={<Bodystats/>}/>
          <Route path="/workout-day" element={<Schedule/>} />
          <Route path="/setup" element={<Setup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/height" element={<Height/>} />
          <Route path="/weight" element={<Weight/>} />
          <Route path="/goal-weight" element={<GoalWeight/>} />
          <Route path="/age" element={<Age/>} />
          <Route path="/exercises" element={<Exercises/>} />
          <Route path='/progress' element={<Progress/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path="/exercise/:id" element={<ExerciseVideo />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
