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
        console.log('📦 Serviços recebidos:', data);
        
        let servicosData = [];
        if (data && data.success && Array.isArray(data.data)) {
          servicosData = data.data;
        } else if (Array.isArray(data)) {
          servicosData = data;
        }
        
        // Filtra apenas serviços ativos
        const servicosAtivos = servicosData.filter(servico => {
          const ativo = parseInt(servico.ativo);
          return ativo === 1;
        });
        
        console.log(`📊 Total: ${servicosData.length} | Ativos: ${servicosAtivos.length}`);
        setServicos(servicosAtivos);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
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
