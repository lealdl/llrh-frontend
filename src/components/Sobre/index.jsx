import { useState, useEffect } from 'react';
import api from '../../services/api';
import './sobre.css';

const Sobre = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarSobre = async () => {
      try {
        const data = await api.getConfiguracoes();
        if (data.success && data.data) {
          setConfig(data.data);
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarSobre();
  }, []);

  if (loading) return null;

  const titulo = config?.sobre_titulo || 'Sobre a LLRH';
  const conteudo = config?.sobre_conteudo || '';
  const missao = config?.sobre_missao || '';
  const visao = config?.sobre_visao || '';
  const valores = config?.sobre_valores || '';

  const removerCoresInline = (html) => {
    if (!html) return '';
    return html.replace(/style="[^"]*color[^"]*"/gi, '');
  };

  const conteudoLimpo = removerCoresInline(conteudo);
  const missaoLimpa = removerCoresInline(missao);
  const visaoLimpa = removerCoresInline(visao);
  const valoresLimpos = removerCoresInline(valores);

  return (
    <section id="sobre" className="sobre">
      <div className="sobre-container">
        <div className="sobre-header">
          <h2>{titulo}</h2>
        </div>
        <div className="sobre-content">
          <div className="sobre-texto" dangerouslySetInnerHTML={{ __html: conteudoLimpo }} />
          <div className="sobre-valores-grid">
            {missao && (
              <div className="valor-card">
                <div className="valor-icon">🎯</div>
                <h3>Nossa Missão</h3>
                <div className="valor-texto" dangerouslySetInnerHTML={{ __html: missaoLimpa }} />
              </div>
            )}
            {visao && (
              <div className="valor-card">
                <div className="valor-icon">👁️</div>
                <h3>Nossa Visão</h3>
                <div className="valor-texto" dangerouslySetInnerHTML={{ __html: visaoLimpa }} />
              </div>
            )}
            {valores && (
              <div className="valor-card">
                <div className="valor-icon">💎</div>
                <h3>Nossos Valores</h3>
                <div className="valor-texto" dangerouslySetInnerHTML={{ __html: valoresLimpos }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;
