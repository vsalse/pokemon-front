import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

type Pokemon = {
  id: number;
  name: string;
  frontDefault: string;
  typeList: string[];
  abilitiesList: string[];
  weight: number;
};

const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/pokemon/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener el Pokémon');
        return res.json();
      })
      .then((data: Pokemon) => setPokemon(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: '2rem 1.5rem', background: 'var(--card-bg)', borderRadius: 16, color: 'var(--text)', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', minHeight: 400 }}>
      <Link to="/pokemon" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500, fontSize: 16 }}>&larr; Volver a la lista</Link>
      {loading && <p style={{ color: 'var(--accent)', textAlign: 'center' }}>Cargando...</p>}
      {error && <p style={{ color: '#ff4f4f', textAlign: 'center' }}>{error}</p>}
      {pokemon && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginTop: 24 }}>
          <img src={pokemon.frontDefault} alt={pokemon.name} width={120} height={120} style={{ background: '#222', borderRadius: 12, border: '2px solid var(--border)' }} />
          <h1 style={{ textTransform: 'capitalize', color: 'var(--accent)', margin: 0 }}>{pokemon.name}</h1>
          <div style={{ fontSize: 17, margin: '6px 0' }}>ID: <span style={{ color: '#ffd86b' }}>{pokemon.id}</span></div>
          <div style={{ fontSize: 17, margin: '6px 0' }}>Tipos: <span style={{ color: '#ffd86b' }}>{pokemon.typeList.join(', ')}</span></div>
          <div style={{ fontSize: 17, margin: '6px 0' }}>Habilidades: <span style={{ color: '#7ee787' }}>{pokemon.abilitiesList.join(', ')}</span></div>
          <div style={{ fontSize: 17, margin: '6px 0' }}>Peso: <span style={{ color: '#8ab4f8' }}>{pokemon.weight}</span></div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetailPage; 