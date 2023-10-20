import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from "./LandingPage";

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
      </Routes>
    </BrowserRouter>
  )
};

export default App;
