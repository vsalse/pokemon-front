import React from 'react';
import Spinner from '../component/Spinner';
import ImageWithLoader from '../component/ImageWithLoader';
import Toast from '../component/Toast';
import { usePokemonDetail } from '../hook/usePokemonDetail';

const PokemonDetailPage: React.FC = () => {
  const {
    pokemon,
    evolutionList,
    loading,
    error,
    setError,
    navigate,
    searchParams,
    id,
  } = usePokemonDetail();

  if (!pokemon) return null;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, minHeight: 600, position: 'relative' }}>
      <Toast message={error?.message || ''} severity={error?.severity} onClose={() => setError(null)} />
      {/* Spinner centrado y fondo difuminado mientras loading */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(24,28,32,0.85)',
          zIndex: 10,
        }}>
          <Spinner size={72} />
        </div>
      )}
      <div style={{ filter: loading ? 'blur(2px)' : 'none', pointerEvents: loading ? 'none' : 'auto', userSelect: loading ? 'none' : 'auto' }}>
        <button
          onClick={() => {
            const page = searchParams.get('page');
            if (page) {
              navigate(`/pokemon?page=${page}`);
            } else {
              navigate('/pokemon');
            }
          }}
          style={{ marginBottom: 16, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 16, cursor: 'pointer' }}
        >Volver</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, background: '#23272f', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.10)', padding: 24, marginBottom: 32 }}>
          <ImageWithLoader src={pokemon.imageDetail || pokemon.imageList} alt={pokemon.name} width={140} height={140} style={{ background: '#fffde4', borderRadius: 16, border: '2px solid #e2b714' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 28, color: '#3b82f6', textTransform: 'capitalize', marginBottom: 8 }}>{pokemon.name}</div>
            <div style={{ fontSize: 16, marginBottom: 6 }}><span style={{ fontWeight: 600 }}>Nº:</span> {pokemon.id}</div>
            <div style={{ fontSize: 16, marginBottom: 6 }}><span style={{ fontWeight: 600 }}>Altura:</span> {pokemon.height} m</div>
            <div style={{ fontSize: 16, marginBottom: 6 }}><span style={{ fontWeight: 600 }}>Peso:</span> {pokemon.weight} kg</div>
            <div style={{ fontSize: 16, marginBottom: 6 }}><span style={{ fontWeight: 600 }}>Tipos:</span> {pokemon.typeList.map((type, idx) => (
              <span key={idx} style={{ color: '#ffd86b', marginLeft: idx > 0 ? 8 : 4 }}>{type}</span>
            ))}</div>
            <div style={{ fontSize: 16, marginBottom: 6 }}><span style={{ fontWeight: 600 }}>Habilidades:</span>
              <ul style={{ color: '#7ee787', margin: 0, paddingLeft: 20, listStyle: 'disc' }}>
                {pokemon.abilitiesList.map((ab, idx) => (
                  <li key={idx}>{ab.replace(/\n/g, ' ')}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div style={{ background: '#23272f', borderRadius: 16, padding: 20, marginBottom: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#e2b714', marginBottom: 8 }}>Descripción</div>
          <div style={{ color: '#fff', fontSize: 16, whiteSpace: 'pre-line' }}>{pokemon.species.flavorText}</div>
        </div>
        <div style={{ background: '#23272f', borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#8ab4f8', marginBottom: 12 }}>Cadena de Evolución</div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 0, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {evolutionList.map((stage, idx) => (
              <React.Fragment key={idx}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
                  {stage.map(poke => {
                    const isCurrent = poke.id === pokemon.id;
                    return (
                      <div
                        key={poke.id}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8, cursor: isCurrent ? 'default' : 'pointer', opacity: isCurrent ? 1 : 0.92 }}
                        onClick={() => { 
                          if (!isCurrent) {
                            const page = searchParams.get('page');
                            if (page) {
                              navigate(`/pokemon/${poke.id}?page=${page}`);
                            } else {
                              navigate(`/pokemon/${poke.id}`);
                            }
                          }
                        }}
                        tabIndex={isCurrent ? -1 : 0}
                        onKeyDown={e => { 
                          if (!isCurrent && e.key === 'Enter') {
                            const page = searchParams.get('page');
                            if (page) {
                              navigate(`/pokemon/${poke.id}?page=${page}`);
                            } else {
                              navigate(`/pokemon/${poke.id}`);
                            }
                          }
                        }}
                        aria-label={isCurrent ? undefined : `Ver detalle de ${poke.name}`}
                      >
                        <div style={{
                          boxShadow: isCurrent ? '0 0 0 5px #3b82f6, 0 0 12px 2px #3b82f6aa' : undefined,
                          borderRadius: '50%',
                          padding: isCurrent ? 6 : 0,
                          background: '#fffde4',
                          transition: 'box-shadow 0.2s, padding 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <ImageWithLoader
                            src={poke.imageList}
                            alt={poke.name}
                            width={72}
                            height={72}
                            style={{
                              background: 'none',
                              borderRadius: '50%',
                              border: isCurrent ? '2.5px solid #3b82f6' : '2px solid #e2b714',
                              marginBottom: 0,
                              transition: 'border 0.2s',
                            }}
                          />
                        </div>
                        <span style={{
                          color: isCurrent ? '#fff' : '#3b82f6',
                          fontWeight: isCurrent ? 900 : 600,
                          textTransform: 'capitalize',
                          background: isCurrent ? 'linear-gradient(90deg,#3b82f6 60%,#e2b714 100%)' : undefined,
                          borderRadius: 8,
                          padding: isCurrent ? '4px 14px' : undefined,
                          marginTop: 6,
                          fontSize: 16,
                          boxShadow: isCurrent ? '0 2px 8px #3b82f655' : undefined,
                          transition: 'all 0.2s'
                        }}>{poke.name}</span>
                      </div>
                    );
                  })}
                </div>
                {idx < evolutionList.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', margin: '0 12px' }}>
                    <span style={{ fontSize: 32, color: '#e2b714' }}>{'\u2192'}</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage; 