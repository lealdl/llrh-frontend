import { useState } from 'react';
import IconPicker from './IconPicker';

const ContatoAdmin = ({ config, onConfigUpdate, showMessage }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onConfigUpdate(name, value);
  };

  const handleIconChange = (name, icon) => {
    onConfigUpdate(name, icon);
  };

  return (
    <div className="tab-content">
      <div className="form-section">
        <h2>Seção Contato</h2>
        
        <h3>📌 Cards de Opções</h3>
        
        <div className="form-group">
          <label>Candidato - Ícone</label>
          <IconPicker 
            value={config?.contato_candidato_icone || '🔗'} 
            onChange={(icon) => handleIconChange('contato_candidato_icone', icon)} 
          />
        </div>
        <div className="form-group">
          <label>Candidato - Título</label>
          <input 
            type="text" 
            name="contato_candidato_titulo" 
            value={config?.contato_candidato_titulo || 'Sou Candidato'} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Candidato - Descrição</label>
          <input 
            type="text" 
            name="contato_candidato_descricao" 
            value={config?.contato_candidato_descricao || 'Busco oportunidades de emprego'} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="form-group">
          <label>Empresa - Ícone</label>
          <IconPicker 
            value={config?.contato_empresa_icone || '🔗'} 
            onChange={(icon) => handleIconChange('contato_empresa_icone', icon)} 
          />
        </div>
        <div className="form-group">
          <label>Empresa - Título</label>
          <input 
            type="text" 
            name="contato_empresa_titulo" 
            value={config?.contato_empresa_titulo || 'Sou Empresa'} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Empresa - Descrição</label>
          <input 
            type="text" 
            name="contato_empresa_descricao" 
            value={config?.contato_empresa_descricao || 'Preciso de serviços de RH'} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="form-group">
          <label>Outro Assunto - Ícone</label>
          <IconPicker 
            value={config?.contato_outro_icone || '🔗'} 
            onChange={(icon) => handleIconChange('contato_outro_icone', icon)} 
          />
        </div>
        <div className="form-group">
          <label>Outro Assunto - Título</label>
          <input 
            type="text" 
            name="contato_outro_titulo" 
            value={config?.contato_outro_titulo || 'Outro Assunto'} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Outro Assunto - Descrição</label>
          <input 
            type="text" 
            name="contato_outro_descricao" 
            value={config?.contato_outro_descricao || 'Dúvidas gerais ou parcerias'} 
            onChange={handleChange} 
          />
        </div>
        
        <h3>📞 Informações de Contato</h3>
        <div className="form-group">
          <label>Telefone</label>
          <input type="text" name="telefone" value={config?.telefone || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>WhatsApp</label>
          <input type="text" name="whatsapp" value={config?.whatsapp || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email_contato" value={config?.email_contato || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Horário de Funcionamento</label>
          <input type="text" name="horario_funcionamento" value={config?.horario_funcionamento || ''} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};

export default ContatoAdmin;
