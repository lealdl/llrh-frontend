import { useState, useEffect } from 'react';
import api from '../../services/api';
import './historia.css';

const Historia = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarConfig = async () => {
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
    carregarConfig();
  }, []);

  if (loading) return null;

  const titulo = config?.historia_titulo || 'Nossa História';
  const conteudo = config?.historia_conteudo || 'Conteúdo da história em breve...';
  const imagem = config?.historia_imagem;

  // Função para remover cores inline do HTML
  const removerCoresInline = (html) => {
    if (!html) return '';
    // Remove style="color: ..." e style="background-color: ..."
    return html.replace(/style="[^"]*color[^"]*"/gi, '');
  };

  const conteudoLimpo = removerCoresInline(conteudo);

  return (
    <section id="historia" className="historia">
      <div className="historia-container">
        <div className="historia-header">
          <h2>{titulo}</h2>
          <p>Conheça a trajetória da LLRH</p>
        </div>

        <div className="historia-content">
          {imagem && (
            <div className="historia-imagem-wrapper">
              <img src={imagem} alt="Nossa História" className="historia-imagem" />
            </div>
          )}
          <div 
            className="historia-texto"
            dangerouslySetInnerHTML={{ __html: conteudoLimpo }}
          />
        </div>
      </div>
    </section>
  );
};

export default Historia;
