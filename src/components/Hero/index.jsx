import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import './hero.css';

const Hero = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregarHero = useCallback(async () => {
    try {
      const data = await api.getConfiguracoes();
      console.log('📦 Configurações do Hero:', data);
      if (data.success && data.data) {
        setConfig(data.data);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarHero();
    
    const handleUpdate = () => {
      carregarHero();
    };
    
    window.addEventListener('heroImageUpdated', handleUpdate);
    window.addEventListener('configuracoesAtualizadas', handleUpdate);
    
    return () => {
      window.removeEventListener('heroImageUpdated', handleUpdate);
      window.removeEventListener('configuracoesAtualizadas', handleUpdate);
    };
  }, [carregarHero]);

  if (loading) {
    return (
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-loading">Carregando...</div>
        </div>
      </section>
    );
  }

  const titulo = config?.hero_titulo || 'LLRH - ATRAÇÃO DE TALENTOS';
  const descricao = config?.hero_descricao || 'Conectamos empresas aos profissionais ideais e transformamos carreiras através de soluções inovadoras em Recursos Humanos.';
  const nomeSite = config?.nome_site || 'LLRH ATRAÇÃO DE TALENTOS';
  const imagemHero = config?.logo_hero_url;

  console.log('🖼️ URL da imagem:', imagemHero);

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-card hero-card-text">
          <h1 className="hero-title">{titulo}</h1>
          <p className="hero-description">{descricao}</p>
          <div className="hero-footer">{nomeSite}</div>
        </div>

        <div className="hero-card hero-card-image">
          {imagemHero ? (
            <img 
              src={imagemHero} 
              alt="Hero" 
              className="hero-img"
              onError={(e) => {
                console.error('❌ Erro ao carregar imagem:', imagemHero);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log('✅ Imagem carregada com sucesso!')}
            />
          ) : (
            <div className="hero-placeholder">
              <span>LLRH</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
