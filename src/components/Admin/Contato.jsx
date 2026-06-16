import { useState, useEffect } from 'react';
import { getConfiguracoes, updateConfiguracoes } from '../../services/api';
import IconPicker from './IconPicker';

const ContatoAdmin = ({ config, onConfigUpdate, showMessage }) => {
  const [formData, setFormData] = useState({
    telefone: '',
    whatsapp: '',
    email_contato: '',
    endereco: '',
    horario_funcionamento: '',
    facebook: '',
    instagram: '',
    linkedin: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData({
        telefone: config.telefone || '',
        whatsapp: config.whatsapp || '',
        email_contato: config.email_contato || '',
        endereco: config.endereco || '',
        horario_funcionamento: config.horario_funcionamento || '',
        facebook: config.facebook || '',
        instagram: config.instagram || '',
        linkedin: config.linkedin || ''
      });
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (onConfigUpdate) {
      onConfigUpdate(name, value);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateConfiguracoes(formData);
      if (result.success) {
        showMessage('✅ Informações de contato salvas com sucesso!', 'success');
      } else {
        showMessage('❌ Erro ao salvar informações', 'error');
      }
    } catch (error) {
      showMessage('❌ Erro de conexão', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tab-content">
      <div className="form-section">
        <h2>📞 Informações de Contato</h2>
        
        <div className="form-group">
          <label>Telefone</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(11) 4000-4443"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="(11) 90000-0000"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Email de Contato</label>
          <input
            type="email"
            name="email_contato"
            value={formData.email_contato}
            onChange={handleChange}
            placeholder="contato@llrh.com.br"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Endereço</label>
          <textarea
            name="endereco"
            rows="3"
            value={formData.endereco}
            onChange={handleChange}
            placeholder="Av. Paulista, 1000 - São Paulo, SP"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Horário de Funcionamento</label>
          <input
            type="text"
            name="horario_funcionamento"
            value={formData.horario_funcionamento}
            onChange={handleChange}
            placeholder="Segunda a Sexta: 9h às 18h"
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? '💾 Salvando...' : '💾 Salvar Contato'}
          </button>
        </div>
      </div>

      <div className="form-section">
        <h2>🌐 Redes Sociais</h2>
        
        <div className="form-group">
          <label>Facebook</label>
          <input
            type="url"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/llrh"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Instagram</label>
          <input
            type="url"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/llrh"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/company/llrh"
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? '💾 Salvando...' : '💾 Salvar Redes Sociais'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContatoAdmin;
