import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import CrackyHome from './CrackyHome'
import CrackyEndless from './CrackyEndless'

export default function App() {

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<CrackyHome />} />
          <Route exact path="/endless" element={<CrackyEndless />} />
        </Routes>
      </BrowserRouter>
    </main>
  )
}
