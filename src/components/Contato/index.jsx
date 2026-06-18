import { useState, useEffect } from 'react';
import api from '../../services/api';
import './contato.css';

const Contato = () => {
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

  const telefone = config?.telefone || '(11) 4000-4433';
  const whatsapp = config?.whatsapp || '(11) 90000-0000';
  const email = config?.email_contato || 'contato@llrh.com.br';
  const horario = config?.horario_funcionamento || 'Segunda a Sexta: 9h às 18h';
  const imagem = config?.contato_imagem;
  
  const candidatoTitulo = config?.contato_candidato_titulo || 'Sou Candidato';
  const candidatoDescricao = config?.contato_candidato_descricao || 'Busco oportunidades de emprego';
  const empresaTitulo = config?.contato_empresa_titulo || 'Sou Empresa';
  const empresaDescricao = config?.contato_empresa_descricao || 'Preciso de serviços de RH';
  const outroTitulo = config?.contato_outro_titulo || 'Outro Assunto';
  const outroDescricao = config?.contato_outro_descricao || 'Dúvidas gerais ou parcerias';

  // Função para abrir WhatsApp
  const handleCardClick = (tipo) => {
    const numeroWhatsApp = whatsapp.replace(/[^0-9]/g, '');
    let mensagem = '';

    switch (tipo) {
      case 'candidato':
        mensagem = encodeURIComponent(`Olá! Sou candidato(a) e gostaria de informações sobre oportunidades de emprego na LLRH.`);
        break;
      case 'empresa':
        mensagem = encodeURIComponent(`Olá! Sou empresa e gostaria de contratar serviços de RH da LLRH.`);
        break;
      case 'outro':
        mensagem = encodeURIComponent(`Olá! Gostaria de tirar uma dúvida ou falar sobre parcerias com a LLRH.`);
        break;
      default:
        return;
    }

    window.open(`https://wa.me/55${numeroWhatsApp}?text=${mensagem}`, '_blank');
  };

  return (
    <section id="contato" className="contato">
      <div className="contato-container">
        <div className="contato-header">
          <h2>Entre em Contato</h2>
          <p>Como podemos ajudar você?</p>
        </div>

        <div className="contato-grid">
          <div className="contato-opcoes">
            <div className="opcao-card" onClick={() => handleCardClick('candidato')}>
              <span className="opcao-icon">🔗</span>
              <div className="opcao-content">
                <h4>{candidatoTitulo}</h4>
                <p>{candidatoDescricao}</p>
              </div>
            </div>

            <div className="opcao-card" onClick={() => handleCardClick('empresa')}>
              <span className="opcao-icon">🔗</span>
              <div className="opcao-content">
                <h4>{empresaTitulo}</h4>
                <p>{empresaDescricao}</p>
              </div>
            </div>

            <div className="opcao-card" onClick={() => handleCardClick('outro')}>
              <span className="opcao-icon">🔗</span>
              <div className="opcao-content">
                <h4>{outroTitulo}</h4>
                <p>{outroDescricao}</p>
              </div>
            </div>
          </div>

          <div className="contato-info-wrapper">
            {imagem && (
              <div className="contato-imagem">
                <img src={imagem} alt="Contato" className="contato-img" />
              </div>
            )}
            <div className="contato-info">
              <h3>📞 Contato</h3>
              <div className="contato-linha">
                <span>Telefone: {telefone}</span>
                <span className="separator">|</span>
                <span>WhatsApp: {whatsapp}</span>
                <span className="separator">|</span>
                <span>Email: {email}</span>
              </div>
            </div>
            <div className="contato-info">
              <h3>🕒 Horário</h3>
              <p>{horario}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contato;
