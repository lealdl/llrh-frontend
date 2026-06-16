import { useState, useEffect } from 'react';
import { getConfiguracoes } from '../../services/api';
import './footer.css';

const Footer = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarConfig = async () => {
      try {
        const data = await getConfiguracoes();
        if (data.success && data.data) {
          setConfig(data.data);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarConfig();
  }, []);

  if (loading) return null;

  const nomeSite = config?.nome_site || 'LLRH - ATRAÇÃO DE TALENTOS';
  
  const redes = {
    facebook: config?.facebook || '#',
    instagram: config?.instagram || '#',
    linkedin: config?.linkedin || '#'
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-copyright">
          © {new Date().getFullYear()} {nomeSite}. Todos os direitos reservados.
        </div>
        
        <div className="footer-social">
          <a href={redes.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
            🔗
          </a>
          <a href={redes.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
            📸
          </a>
          <a href={redes.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
            👍
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
