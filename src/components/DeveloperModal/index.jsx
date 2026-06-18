import React, { useState, useEffect } from 'react';
import { getConfiguracoes } from '../../services/api';
import './developerModal.css';

const DeveloperModal = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const carregarDados = async () => {
        try {
          const response = await getConfiguracoes();
          if (response.success && response.data) {
            setConfig(response.data);
          }
        } catch (error) {
          console.error('Erro ao carregar dados do dev:', error);
        }
      };
      carregarDados();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const avatarUrl = config?.dev_avatar_url;
  const avatarEmoji = config?.dev_avatar || '👨‍💻';
  const nome = config?.dev_nome || 'Luciano Leal';
  const cargo = config?.dev_cargo || 'Desenvolvedor Full Stack';
  const email = config?.dev_email || 'luciano@lealdev.com';
  const tecnologias = config?.dev_tecnologias || 'React • JavaScript • SQLite • PHP • HTML5 • CSS3';
  const projeto = config?.dev_projeto || 'LLRH - Atração de Talentos';
  const versao = config?.dev_versao || '1.0.0';
  const github = config?.dev_github || 'https://github.com/seu-usuario';
  const linkedin = config?.dev_linkedin || 'https://linkedin.com/in/seu-usuario';

  return (
    <div className="dev-modal-overlay" onClick={onClose}>
      <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
        <button className="dev-modal-close" onClick={onClose}>×</button>
        
        <div className="dev-modal-content">
          <div className="dev-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="dev-avatar-img" />
            ) : (
              <span style={{ fontSize: '2.5rem' }}>{avatarEmoji}</span>
            )}
          </div>
          
          <h2>Desenvolvido por</h2>
          <h3>{nome}</h3>
          
          <div className="dev-info">
            <p>
              <span className="dev-label">💼 Cargo:</span>
              <span>{cargo}</span>
            </p>
            <p>
              <span className="dev-label">📧 Email:</span>
              <span>{email}</span>
            </p>
            <p>
              <span className="dev-label">💻 Tecnologias:</span>
              <span>{tecnologias}</span>
            </p>
            <p>
              <span className="dev-label">📅 Projeto:</span>
              <span>{projeto}</span>
            </p>
            <p>
              <span className="dev-label">📆 Versão:</span>
              <span>{versao}</span>
            </p>
          </div>
          
          <div className="dev-social">
            <a href={github} target="_blank" rel="noopener noreferrer" title="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          
          <div className="dev-footer">
            <span>© 2024 • Feito com ❤️</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperModal;
