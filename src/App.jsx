import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import Dashboard from './components/Dashboard';
import Focusarea from './pages/FocusArea';
import Weight from './pages/Weight';
import GoalWeight from './pages/GoalWeight';
import Age from './pages/Age';
import Height from './pages/Height';
import Exercises from './pages/Exercises';
import Progress from './pages/Progress';
import Profile from './pages/Profile';

const App = () => {
  const { isSignedIn } = useAuth(); // Check if the user is signed in

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={isSignedIn ? <Navigate to="/home" /> : <Landing />} />
          <Route path="/gender" element={<Gender/>} />
          <Route path="/goal" element={<Goal/>} />
          <Route path="/focusarea" element={<Focusarea/>} />
          <Route path="/equipment" element={<Equipment/>}/>
          <Route path='/level' element={<Level/>}/>
          <Route path='/bodystats' element={<Bodystats/>}/>
          <Route path="/workout-day" element={<WorkoutDay/>} />
          <Route path="/setup" element={<Setup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/home" element={<Dashboard/>} />
          <Route path="/height" element={<Height/>} />
          <Route path="/weight" element={<Weight/>} />
          <Route path="/goal-weight" element={<GoalWeight/>} />
          <Route path="/age" element={<Age/>} />
          <Route path="/exercises" element={<Exercises/>} />
          <Route path='/progress' element={<Progress/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
