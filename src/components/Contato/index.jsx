import { useState, useEffect } from 'react';
import api from '../../services/api';
import './contato.css';

const Contato = () => {
  const [config, setConfig] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    const carregarConfig = async () => {
      try {
        const data = await api.getConfiguracoes();
        if (data.success && data.data) {
          setConfig(data.data);
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    };
    carregarConfig();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMensagem({ type: 'success', text: 'Mensagem enviada com sucesso!' });
      setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
      setTimeout(() => setMensagem(null), 5000);
    } catch (error) {
      setMensagem({ type: 'error', text: 'Erro ao enviar mensagem. Tente novamente.' });
    } finally {
      setEnviando(false);
    }
  };

  const telefone = config?.telefone || '(11) 4000-4443';
  const email = config?.email_contato || 'contato@llrh.com.br';
  const horario = config?.horario_funcionamento || 'Segunda a Sexta: 9h às 18h';
  const imagem = config?.contato_imagem;

  return (
    <section id="contato" className="contato">
      <div className="contato-container">
        <div className="contato-header">
          <h2>Fale Conosco</h2>
          <p>Estamos aqui para ajudar você!</p>
        </div>

        <div className="contato-grid">
          <div className="contato-form-wrapper">
            <form onSubmit={handleSubmit} className="contato-form">
              <div className="form-group">
                <label>Nome completo</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Seu nome" />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="seu@email.com" />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" />
              </div>
              <div className="form-group">
                <label>Mensagem</label>
                <textarea name="mensagem" rows="4" value={formData.mensagem} onChange={handleChange} required placeholder="Digite sua mensagem..." />
              </div>
              <button type="submit" disabled={enviando} className="btn-enviar">
                {enviando ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
              {mensagem && <div className={`mensagem-feedback ${mensagem.type}`}>{mensagem.text}</div>}
            </form>
          </div>

          <div className="contato-info-wrapper">
            {imagem && (
              <div className="contato-imagem">
                <img src={imagem} alt="Contato" className="contato-img" />
              </div>
            )}
            <div className="contato-info">
              <h3>📞 Contato</h3>
              <p>Telefone: {telefone}</p>
              <p>Email: {email}</p>
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
