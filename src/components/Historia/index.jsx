import { useState, useEffect } from 'react';
import api from '../../services/api';
import './historia.css';

const Historia = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await api.getConfiguracoes();
        if (data.success && data.data) {
          setConfig(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
    
    window.addEventListener('historiaUpdated', carregar);
    return () => window.removeEventListener('historiaUpdated', carregar);
  }, []);

  if (loading) return null;
  if (!config?.historia_conteudo) return null;

  return (
    <section id="historia" className="historia">
      <div className="historia-container">
        <div className="historia-header">
          <h2>{config.historia_titulo || 'Nossa História'}</h2>
          <span className="historia-ano">Desde {config.historia_fundacao || '2020'}</span>
        </div>
        <div className="historia-content" dangerouslySetInnerHTML={{ __html: config.historia_conteudo }} />
      </div>
    </section>
  );
};

export default Historia;
