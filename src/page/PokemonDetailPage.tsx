import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { useParams, Link } from 'react-router-dom';

type Pokemon = {
  id: number;
  name: string;
  frontDefault: string;
  typeList: string[];
  abilitiesList: string[];
  weight: number;
  height: number;
  species: string;
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
      {loading && <Spinner size={64} />}
      {error && <p style={{ color: '#ff4f4f', textAlign: 'center' }}>{error}</p>}
      {pokemon && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginTop: 32 }}>
          <img src={pokemon.frontDefault} alt={pokemon.name} width={180} height={180} style={{ background: '#222', borderRadius: 16, border: '3px solid var(--accent)', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }} />
          <h1 style={{ textTransform: 'capitalize', color: 'var(--accent)', margin: '0 0 8px 0', fontSize: 36, letterSpacing: 1 }}>{pokemon.name}</h1>
          <div style={{
            fontSize: 18,
            margin: '16px 0 10px 0',
            color: '#222',
            textAlign: 'left',
            whiteSpace: 'pre-line',
            maxWidth: 420,
            background: 'linear-gradient(90deg, #ffe082 0%, #fffde4 100%)',
            borderRadius: 12,
            border: '2px solid #e2b714',
            boxShadow: '0 2px 8px rgba(226,183,20,0.10)',
            padding: '18px 20px',
            fontWeight: 500,
            letterSpacing: 0.2,
          }}>
            <span style={{ color: '#b48a00', fontWeight: 700, fontSize: 19 }}>Descripción:</span><br />
            {pokemon.species.replace(/\n/g, ' ')}
          </div>
          <div style={{ display: 'flex', gap: 32, margin: '18px 0 0 0', width: '100%', justifyContent: 'center' }}>
            <div style={{ fontSize: 18 }}>ID: <span style={{ color: '#ffd86b', fontWeight: 500 }}>{pokemon.id}</span></div>
            <div style={{ fontSize: 18 }}>Peso: <span style={{ color: '#8ab4f8', fontWeight: 500 }}>{pokemon.weight}</span></div>
            <div style={{ fontSize: 18 }}>Altura: <span style={{ color: '#8ab4f8', fontWeight: 500 }}>{pokemon.height}</span></div>
          </div>
          <div style={{ fontSize: 18, margin: '18px 0 0 0', width: '100%' }}>
            <strong>Tipos:</strong>
            <ul style={{ color: '#ffd86b', margin: 0, paddingLeft: 20, listStyle: 'none', fontSize: 17 }}>
              {pokemon.typeList.map((type, idx) => (
                <li key={idx} style={{ paddingLeft: 0, marginBottom: 2 }}>• {type}</li>
              ))}
            </ul>
          </div>
          <div style={{ fontSize: 18, margin: '18px 0 0 0', width: '100%' }}>
            <strong>Habilidades:</strong>
            <ul style={{ color: '#7ee787', margin: 0, paddingLeft: 20, listStyle: 'none', fontSize: 17 }}>
              {pokemon.abilitiesList.map((ability, idx) => (
                <li key={idx} style={{ paddingLeft: 0, marginBottom: 2 }}>• {ability}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetailPage; 