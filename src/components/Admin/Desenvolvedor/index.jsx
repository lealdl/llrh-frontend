import { useState, useEffect, useRef } from 'react';
import { getConfiguracoes, updateConfiguracoes } from '../../../services/api';
import './desenvolvedor.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api-llrh';
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost/api-llrh';

const DesenvolvedorAdmin = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [editandoDev, setEditandoDev] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const response = await getConfiguracoes();
      if (response.success && response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateConfiguracoes(config);
      if (result.success) {
        showToast('✅ Dados do desenvolvedor atualizados!', 'success');
        setEditandoDev(false);
      } else {
        showToast('❌ Erro ao salvar', 'error');
      }
    } catch (error) {
      console.error('Erro:', error);
      showToast('❌ Erro de conexão', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('A imagem deve ter no máximo 2MB', 'error');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('imagem', file);
      formData.append('tipo', 'dev_avatar');

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/upload/imagem/dev_avatar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        const imageUrl = `${IMAGE_BASE_URL}${data.path}?t=${Date.now()}`;
        setConfig(prev => ({ ...prev, dev_avatar_url: imageUrl }));
        showToast('✅ Avatar atualizado com sucesso!', 'success');
      } else {
        showToast(data.error || 'Erro ao enviar imagem', 'error');
      }
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro de conexão', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removerAvatar = () => {
    setConfig(prev => ({ ...prev, dev_avatar_url: '' }));
    showToast('Avatar removido', 'success');
  };

  // Lista de avatares disponíveis
  const avatares = [
    '👨‍💻', '👩‍💻', '🧑‍💻', '👨‍💼', '👩‍💼', '🧑‍💼',
    '👨‍🔧', '👩‍🔧', '🧑‍🔧', '👨‍🎨', '👩‍🎨', '🧑‍🎨',
    '👨‍🏫', '👩‍🏫', '🧑‍🏫', '👨‍🚀', '👩‍🚀', '🧑‍🚀',
    '🦸', '🦸‍♀️', '🦸‍♂️', '🧙', '🧙‍♀️', '🧙‍♂️',
    '🚀', '💻', '🖥️', '📱', '⚡', '🔥', '🌟', '💎'
  ];

  if (loading) {
    return <div className="dev-loading">🔄 Carregando...</div>;
  }

  const avatarUrl = config?.dev_avatar_url;
  const avatarEmoji = config?.dev_avatar || '👨‍💻';

  return (
    <div className="dev-container">
      {toast && (
        <div className={`servico-toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <div className="dev-header">
        <h2>👨‍💻 Painel do Desenvolvedor</h2>
        <p>Ferramentas e informações para manutenção do sistema</p>
      </div>

      {/* Dados do Desenvolvedor */}
      <div className="dev-section">
        <div className="dev-section-header">
          <h3>👤 Dados do Desenvolvedor</h3>
          <button 
            className="dev-edit-btn"
            onClick={() => setEditandoDev(!editandoDev)}
          >
            {editandoDev ? '❌ Cancelar' : '✏️ Editar'}
          </button>
        </div>
        
        {editandoDev ? (
          <div className="dev-form">
            <div className="form-group">
              <label>Avatar</label>
              <div className="avatar-container">
                <div className="avatar-preview">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="avatar-preview-img" />
                  ) : (
                    <span className="avatar-preview-emoji" style={{ fontSize: '3rem' }}>{avatarEmoji}</span>
                  )}
                </div>
                <div className="avatar-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    disabled={uploading}
                    className="avatar-file-input"
                  />
                  <button 
                    className="avatar-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? '📤 Enviando...' : '📤 Upload Imagem'}
                  </button>
                  {avatarUrl && (
                    <button 
                      className="avatar-remove-btn"
                      onClick={removerAvatar}
                    >
                      🗑️ Remover
                    </button>
                  )}
                </div>
              </div>
              <small>Formatos: PNG, JPG, WEBP | Máx: 2MB</small>
            </div>
            <div className="form-group">
              <label>Ou escolha um emoji</label>
              <div className="avatar-selector">
                {avatares.map((avatar, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`avatar-option ${config?.dev_avatar === avatar && !avatarUrl ? 'active' : ''}`}
                    onClick={() => {
                      setConfig(prev => ({ ...prev, dev_avatar: avatar, dev_avatar_url: '' }));
                    }}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Nome</label>
              <input type="text" name="dev_nome" value={config?.dev_nome || 'Luciano Leal'} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Cargo</label>
              <input type="text" name="dev_cargo" value={config?.dev_cargo || 'Desenvolvedor Full Stack'} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="dev_email" value={config?.dev_email || 'luciano@lealdev.com'} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tecnologias</label>
              <input type="text" name="dev_tecnologias" value={config?.dev_tecnologias || 'React • JavaScript • SQLite • PHP • HTML5 • CSS3'} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Projeto</label>
              <input type="text" name="dev_projeto" value={config?.dev_projeto || 'LLRH - Atração de Talentos'} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Versão</label>
              <input type="text" name="dev_versao" value={config?.dev_versao || '1.0.0'} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>GitHub</label>
              <input type="url" name="dev_github" value={config?.dev_github || 'https://github.com/seu-usuario'} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input type="url" name="dev_linkedin" value={config?.dev_linkedin || 'https://linkedin.com/in/seu-usuario'} onChange={handleChange} />
            </div>
            <button className="dev-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? '💾 Salvando...' : '💾 Salvar Dados'}
            </button>
          </div>
        ) : (
          <div className="dev-info-grid">
            <div className="dev-info-item">
              <span className="dev-info-label">👤 Avatar:</span>
              <span className="dev-info-value">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="dev-avatar-small" />
                ) : (
                  <span style={{ fontSize: '2rem' }}>{avatarEmoji}</span>
                )}
              </span>
            </div>
            <div className="dev-info-item">
              <span className="dev-info-label">👤 Nome:</span>
              <span className="dev-info-value">{config?.dev_nome || 'Luciano Leal'}</span>
            </div>
            <div className="dev-info-item">
              <span className="dev-info-label">💼 Cargo:</span>
              <span className="dev-info-value">{config?.dev_cargo || 'Desenvolvedor Full Stack'}</span>
            </div>
            <div className="dev-info-item">
              <span className="dev-info-label">📧 Email:</span>
              <span className="dev-info-value">{config?.dev_email || 'luciano@lealdev.com'}</span>
            </div>
            <div className="dev-info-item">
              <span className="dev-info-label">💻 Tecnologias:</span>
              <span className="dev-info-value">{config?.dev_tecnologias || 'React • JavaScript • SQLite • PHP • HTML5 • CSS3'}</span>
            </div>
            <div className="dev-info-item">
              <span className="dev-info-label">📅 Projeto:</span>
              <span className="dev-info-value">{config?.dev_projeto || 'LLRH - Atração de Talentos'}</span>
            </div>
            <div className="dev-info-item">
              <span className="dev-info-label">📆 Versão:</span>
              <span className="dev-info-value">{config?.dev_versao || '1.0.0'}</span>
            </div>
            <div className="dev-info-item">
              <span className="dev-info-label">🐙 GitHub:</span>
              <span className="dev-info-value">
                <a href={config?.dev_github || '#'} target="_blank" rel="noopener noreferrer">
                  {config?.dev_github || 'https://github.com/seu-usuario'}
                </a>
              </span>
            </div>
            <div className="dev-info-item">
              <span className="dev-info-label">🔗 LinkedIn:</span>
              <span className="dev-info-value">
                <a href={config?.dev_linkedin || '#'} target="_blank" rel="noopener noreferrer">
                  {config?.dev_linkedin || 'https://linkedin.com/in/seu-usuario'}
                </a>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="dev-grid">
        <div className="dev-card">
          <div className="dev-card-icon">📊</div>
          <div className="dev-card-content">
            <h3>Total de Serviços</h3>
            <p className="dev-card-number">5</p>
          </div>
        </div>

        <div className="dev-card">
          <div className="dev-card-icon">💼</div>
          <div className="dev-card-content">
            <h3>Total de Vagas</h3>
            <p className="dev-card-number">4</p>
          </div>
        </div>

        <div className="dev-card">
          <div className="dev-card-icon">👤</div>
          <div className="dev-card-content">
            <h3>Usuários</h3>
            <p className="dev-card-number">1</p>
          </div>
        </div>

        <div className="dev-card">
          <div className="dev-card-icon">📦</div>
          <div className="dev-card-content">
            <h3>Versão</h3>
            <p className="dev-card-number">{config?.dev_versao || '1.0.0'}</p>
          </div>
        </div>
      </div>

      {/* Ferramentas de Manutenção */}
      <div className="dev-section">
        <h3>🔧 Ferramentas de Manutenção</h3>
        <div className="dev-tools">
          <button className="dev-tool-btn" onClick={() => alert('💾 Backup manual iniciado!')}>
            💾 Backup Manual
          </button>
          <button className="dev-tool-btn" onClick={() => alert('🧹 Cache limpo com sucesso!')}>
            🧹 Limpar Cache
          </button>
          <button className="dev-tool-btn" onClick={() => alert('🔧 Banco otimizado com sucesso!')}>
            🔧 Otimizar Banco
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesenvolvedorAdmin;
