import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PokemonListPage from './page/PokemonListPage';
import PokemonDetailPage from './page/PokemonDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pokemon" element={<PokemonListPage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        <Route path="*" element={<Navigate to="/pokemon" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
