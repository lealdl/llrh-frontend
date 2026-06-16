import { useState, useEffect } from 'react';
import api from '../../services/api';
import './servicos.css';

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarServicos = async () => {
      try {
        const data = await api.getServicos();
        if (data && data.success && Array.isArray(data.data)) {
          setServicos(data.data);
        } else if (Array.isArray(data)) {
          setServicos(data);
        } else {
          setServicos([]);
        }
      } catch (error) {
        console.error('Erro:', error);
        setServicos([]);
      } finally {
        setLoading(false);
      }
    };
    carregarServicos();
  }, []);

  if (loading) return null;
  if (servicos.length === 0) return null;

  return (
    <section id="servicos" className="servicos">
      <div className="servicos-container">
        <div className="servicos-header">
          <h2>Nossos Serviços</h2>
          <p>Conheça as soluções que oferecemos para sua empresa</p>
        </div>
        <div className="servicos-grid">
          {servicos.map(servico => (
            <div key={servico.id} className="servico-card">
              <div className="servico-icon">{servico.icone || '💼'}</div>
              <h3>{servico.titulo}</h3>
              <p>{servico.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Servicos;
