import { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

const HistoriaAdmin = ({ config, onConfigUpdate, onSave, saving, showMessage }) => {
  const [formData, setFormData] = useState({
    historia_titulo: '',
    historia_fundacao: '',
    historia_conteudo: ''
  });

  useEffect(() => {
    if (config) {
      setFormData({
        historia_titulo: config.historia_titulo || 'Nossa História',
        historia_fundacao: config.historia_fundacao || '2020',
        historia_conteudo: config.historia_conteudo || ''
      });
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (onConfigUpdate) {
      onConfigUpdate({ ...config, [name]: value });
    }
  };

  const handleConteudoChange = (value) => {
    setFormData(prev => ({ ...prev, historia_conteudo: value }));
    if (onConfigUpdate) {
      onConfigUpdate({ ...config, historia_conteudo: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="historia-container">
      <h2>📖 Nossa História</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="historia-grid">
          <div className="historia-form-group">
            <label>Título</label>
            <input
              type="text"
              name="historia_titulo"
              value={formData.historia_titulo}
              onChange={handleChange}
              placeholder="Ex: Nossa História"
            />
          </div>
          
          <div className="historia-form-group">
            <label>Ano de Fundação</label>
            <input
              type="text"
              name="historia_fundacao"
              value={formData.historia_fundacao}
              onChange={handleChange}
              placeholder="Ex: 2020"
            />
          </div>
        </div>
        
        <div className="historia-editor">
          <label>Conteúdo da História</label>
          <RichTextEditor
            value={formData.historia_conteudo}
            onChange={handleConteudoChange}
            placeholder="Digite a história da empresa aqui. Use as ferramentas de formatação para deixar o texto mais rico..."
          />
        </div>
        
        {/* Preview do conteúdo */}
        {formData.historia_conteudo && (
          <div className="historia-preview">
            <h3>👁️ Preview do conteúdo (como ficará no site)</h3>
            <div 
              className="historia-preview-content"
              dangerouslySetInnerHTML={{ __html: formData.historia_conteudo }}
            />
          </div>
        )}
        
        <div className="historia-actions">
          <button type="submit" className="btn-historia-save" disabled={saving}>
            {saving ? '💾 Salvando...' : '💾 Salvar História'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HistoriaAdmin;
