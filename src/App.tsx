import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from "./LandingPage";
import Chat from "./Chat";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Chat /> } />
      </Routes>
    </BrowserRouter>
  )
};

export default App;
