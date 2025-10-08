import React from 'react'
import {HashRouter, Routes, Route} from "react-router-dom";
import CrackyHome from './CrackyHome'
import CrackyEndless from './CrackyEndless'

export default function App() {

  return (
    <main>
      <HashRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route exact path="/" element={<CrackyHome />} />
          <Route exact path="/endless" element={<CrackyEndless />} />
        </Routes>
      </HashRouter>
    </main>
  )
}
