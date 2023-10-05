import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from "./LandingPage";
import Leaderboard from "./Leaderboard";
import Signup from "./Signup";
import Vote from "./Vote";
import Profile from "./Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/signup" element={ <Signup /> } />
        <Route path="/leaderboard" element={ <Leaderboard /> } />
        <Route path="/vote" element={ <Vote /> } />
        <Route path="/profile/:userId" element={ <Profile /> } />
      </Routes>
    </BrowserRouter>
  )
};

export default App;
