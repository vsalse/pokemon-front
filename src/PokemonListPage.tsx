import React, { useEffect, useState } from 'react';

type Pokemon = {
  id: number;
  name: string;
  frontDefault: string;
  typeList: string[];
  abilitiesList: string[];
  weight: number;
};

const PokemonListPage: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/pokemon?page=${page}&size=${size}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener los Pokémon');
        return res.json();
      })
      .then((data: Pokemon[]) => setPokemons(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, size]);

  const handlePrev = () => setPage(p => Math.max(0, p - 1));
  const handleNext = () => setPage(p => p + 1);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '1rem' }}>
      <h1>Pokémon List</h1>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="size-select">Pokémon por página: </label>
        <select id="size-select" value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0); }}>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pokemons.map((poke: Pokemon) => (
          <div key={poke.id} style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: 8, padding: 12, background: '#fafafa' }}>
            <img src={poke.frontDefault} alt={poke.name} width={72} height={72} style={{ marginRight: 16 }} />
            <div>
              <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{poke.name}</h2>
              <div>Tipos: {poke.typeList.join(', ')}</div>
              <div>Habilidades: {poke.abilitiesList.join(', ')}</div>
              <div>Peso: {poke.weight}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button onClick={handlePrev} disabled={page === 0}>Anterior</button>
        <span>Página {page + 1}</span>
        <button onClick={handleNext} disabled={pokemons.length < size}>Siguiente</button>
      </div>
    </div>
  );
};

export default PokemonListPage; 