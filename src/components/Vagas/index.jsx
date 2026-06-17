import { useState, useEffect } from 'react';
import { getVagas } from '../../services/api';
import './vagas.css';

const Vagas = () => {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarVagas = async () => {
      try {
        const response = await getVagas();
        console.log('📦 Vagas do banco:', response);
        if (response.success && response.data) {
          setVagas(response.data);
        } else {
          setVagas([]);
        }
      } catch (error) {
        console.error('Erro ao carregar vagas:', error);
        setVagas([]);
      } finally {
        setLoading(false);
      }
    };
    carregarVagas();
  }, []);

  if (loading) return null;
  if (vagas.length === 0) return null;

  return (
    <section id="vagas" className="vagas">
      <div className="vagas-container">
        <div className="vagas-header">
          <h2>Vagas em Destaque</h2>
          <p>Encontre a oportunidade ideal para sua carreira</p>
        </div>

        <div className="vagas-grid">
          {vagas.map(vaga => {
            const isBloqueado = parseInt(vaga.bloqueado) === 1;
            return (
              <div key={vaga.id} className={`vaga-card ${isBloqueado ? 'bloqueada' : 'desbloqueada'}`}>
                {isBloqueado && <span className="vaga-badge">🔒 Em breve</span>}
                <div className="vaga-card-header">
                  <h3>{vaga.titulo}</h3>
                  <span className={`vaga-tipo ${vaga.tipo === 'PJ' ? 'tipo-pj' : 'tipo-clt'}`}>
                    {vaga.tipo}
                  </span>
                </div>
                
                <div className="vaga-info">
                  <div className="vaga-info-item">
                    <span className="info-icon">📍</span>
                    <span>{vaga.localizacao}</span>
                  </div>
                  <div className="vaga-info-item">
                    <span className="info-icon">💰</span>
                    <span>{vaga.salario}</span>
                  </div>
                </div>
                
                <p className="vaga-descricao">{vaga.descricao}</p>
                
                <button 
                  className="vaga-btn-candidatar" 
                  disabled={isBloqueado}
                  style={!isBloqueado ? { 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white',
                    cursor: 'pointer'
                  } : {}}
                >
                  {isBloqueado ? '🔒 Em breve' : '📩 Candidatar-se'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Vagas;
