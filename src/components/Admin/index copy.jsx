import { useState, useEffect } from 'react';
import { getConfiguracoes, updateConfiguracoes } from '../../services/api';
import './admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('geral');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    carregarConfig();
  }, []);

  const carregarConfig = async () => {
    try {
      const result = await getConfiguracoes();
      if (result.success) {
        setConfig(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar config:', error);
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
        alert('Configurações salvas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, campo) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('imagem', file);
    formData.append('campo', campo);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/api-llrh/admin/upload-imagem', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        setConfig(prev => ({ ...prev, [campo]: result.url }));
        alert('Imagem enviada com sucesso!');
      } else {
        alert('Erro ao enviar imagem');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Carregando...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'geral' ? 'active' : ''}`} onClick={() => setActiveTab('geral')}>
          Informações Gerais
        </button>
        <button className={`tab-btn ${activeTab === 'redes' ? 'active' : ''}`} onClick={() => setActiveTab('redes')}>
          Redes Sociais
        </button>
        <button className={`tab-btn ${activeTab === 'sobre' ? 'active' : ''}`} onClick={() => setActiveTab('sobre')}>
          Sobre
        </button>
        <button className={`tab-btn ${activeTab === 'servicos' ? 'active' : ''}`} onClick={() => setActiveTab('servicos')}>
          Serviços
        </button>
        <button className={`tab-btn ${activeTab === 'contato' ? 'active' : ''}`} onClick={() => setActiveTab('contato')}>
          Contato
        </button>
        <button className={`tab-btn ${activeTab === 'imagens' ? 'active' : ''}`} onClick={() => setActiveTab('imagens')}>
          Imagens
        </button>
        <button className={`tab-btn ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}>
          SEO
        </button>
        <button className={`tab-btn ${activeTab === 'historia' ? 'active' : ''}`} onClick={() => setActiveTab('historia')}>
          Nossa História
        </button>
      </div>

      <div className="admin-content">
        {/* ABA GERAL */}
        {activeTab === 'geral' && (
          <div className="admin-section">
            <h2>Informações Gerais</h2>
            <div className="admin-form">
              <div className="form-group">
                <label>Hero Título</label>
                <input type="text" name="hero_titulo" value={config?.hero_titulo || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Nome do Site</label>
                <input type="text" name="nome_site" value={config?.nome_site || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email de Contato</label>
                <input type="email" name="email_contato" value={config?.email_contato || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input type="text" name="telefone" value={config?.telefone || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input type="text" name="whatsapp" value={config?.whatsapp || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Endereço</label>
                <input type="text" name="endereco" value={config?.endereco || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Horário de Funcionamento</label>
                <input type="text" name="horario_funcionamento" value={config?.horario_funcionamento || ''} onChange={handleChange} />
              </div>
              <button className="btn-salvar" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}

        {/* ABA REDES SOCIAIS */}
        {activeTab === 'redes' && (
          <div className="admin-section">
            <h2>Redes Sociais</h2>
            <div className="admin-form">
              <div className="form-group">
                <label>Facebook</label>
                <input type="url" name="facebook" value={config?.facebook || ''} onChange={handleChange} placeholder="https://facebook.com/seu-perfil" />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input type="url" name="instagram" value={config?.instagram || ''} onChange={handleChange} placeholder="https://instagram.com/seu-perfil" />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input type="url" name="linkedin" value={config?.linkedin || ''} onChange={handleChange} placeholder="https://linkedin.com/company/seu-perfil" />
              </div>
              <div className="form-group">
                <label>YouTube</label>
                <input type="url" name="youtube" value={config?.youtube || ''} onChange={handleChange} placeholder="https://youtube.com/seu-canal" />
              </div>
              <button className="btn-salvar" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}

        {/* ABA SOBRE */}
        {activeTab === 'sobre' && (
          <div className="admin-section">
            <h2>Sobre</h2>
            <div className="admin-form">
              <div className="form-group">
                <label>Título</label>
                <input type="text" name="sobre_titulo" value={config?.sobre_titulo || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Conteúdo</label>
                <textarea name="sobre_conteudo" rows="6" value={config?.sobre_conteudo || ''} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Missão</label>
                <textarea name="sobre_missao" rows="3" value={config?.sobre_missao || ''} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Visão</label>
                <textarea name="sobre_visao" rows="3" value={config?.sobre_visao || ''} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Valores</label>
                <textarea name="sobre_valores" rows="3" value={config?.sobre_valores || ''} onChange={handleChange}></textarea>
              </div>
              <button className="btn-salvar" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}

        {/* ABA SERVIÇOS */}
        {activeTab === 'servicos' && (
          <div className="admin-section">
            <h2>Serviços</h2>
            <div className="admin-form">
              <div className="form-group">
                <label>Título da Seção</label>
                <input type="text" name="servicos_titulo" value={config?.servicos_titulo || 'Nossos Serviços'} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Descrição da Seção</label>
                <textarea name="servicos_descricao" rows="3" value={config?.servicos_descricao || ''} onChange={handleChange}></textarea>
              </div>
              <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '8px' }}>
                Os serviços individuais são gerenciados na seção "Serviços" do menu lateral.
              </p>
              <button className="btn-salvar" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}

        {/* ABA CONTATO */}
        {activeTab === 'contato' && (
          <div className="admin-section">
            <h2>Contato</h2>
            <div className="admin-form">
              <div className="form-group">
                <label>Título da Página</label>
                <input type="text" name="contato_titulo" value={config?.contato_titulo || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Subtítulo</label>
                <input type="text" name="contato_subtitulo" value={config?.contato_subtitulo || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email_contato" value={config?.email_contato || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input type="text" name="telefone" value={config?.telefone || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input type="text" name="whatsapp" value={config?.whatsapp || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Endereço</label>
                <input type="text" name="endereco" value={config?.endereco || ''} onChange={handleChange} />
              </div>
              <button className="btn-salvar" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}

        {/* ABA IMAGENS - COM UPLOAD DE ARQUIVOS */}
        {activeTab === 'imagens' && (
          <div className="admin-section">
            <h2>Imagens</h2>
            <div className="admin-form">
              <div className="form-group">
                <label>Logo</label>
                {config?.logo_url && (
                  <div style={{ marginBottom: '8px' }}>
                    <img src={config.logo_url} alt="Logo" style={{ maxHeight: '80px', borderRadius: '4px', border: '1px solid #ddd' }} />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo_url')} disabled={uploading} />
                <small style={{ display: 'block', color: '#999', marginTop: '4px' }}>Formatos: PNG, JPG, WEBP | Máx: 2MB</small>
              </div>

              <div className="form-group">
                <label>Logo Hero</label>
                {config?.logo_hero_url && (
                  <div style={{ marginBottom: '8px' }}>
                    <img src={config.logo_hero_url} alt="Logo Hero" style={{ maxHeight: '80px', borderRadius: '4px', border: '1px solid #ddd' }} />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo_hero_url')} disabled={uploading} />
                <small style={{ display: 'block', color: '#999', marginTop: '4px' }}>Formatos: PNG, JPG, WEBP | Máx: 2MB</small>
              </div>

              <div className="form-group">
                <label>Favicon</label>
                {config?.favicon_url && (
                  <div style={{ marginBottom: '8px' }}>
                    <img src={config.favicon_url} alt="Favicon" style={{ maxHeight: '40px', borderRadius: '4px', border: '1px solid #ddd' }} />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'favicon_url')} disabled={uploading} />
                <small style={{ display: 'block', color: '#999', marginTop: '4px' }}>Formatos: PNG, ICO, SVG | Máx: 1MB</small>
              </div>

              <div className="form-group">
                <label>Imagem do Contato</label>
                {config?.contato_imagem && (
                  <div style={{ marginBottom: '8px' }}>
                    <img src={config.contato_imagem} alt="Imagem Contato" style={{ maxHeight: '80px', borderRadius: '4px', border: '1px solid #ddd' }} />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'contato_imagem')} disabled={uploading} />
                <small style={{ display: 'block', color: '#999', marginTop: '4px' }}>Formatos: PNG, JPG, WEBP | Máx: 2MB</small>
              </div>

              <div className="form-group">
                <label>Imagem da História</label>
                {config?.historia_imagem && (
                  <div style={{ marginBottom: '8px' }}>
                    <img src={config.historia_imagem} alt="Imagem História" style={{ maxHeight: '80px', borderRadius: '4px', border: '1px solid #ddd' }} />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'historia_imagem')} disabled={uploading} />
                <small style={{ display: 'block', color: '#999', marginTop: '4px' }}>Formatos: PNG, JPG, WEBP | Máx: 2MB</small>
              </div>

              {uploading && <p style={{ color: '#667eea' }}>Enviando imagem...</p>}
            </div>
          </div>
        )}

        {/* ABA SEO */}
        {activeTab === 'seo' && (
          <div className="admin-section">
            <h2>SEO</h2>
            <div className="admin-form">
              <div className="form-group">
                <label>Meta Title</label>
                <input type="text" name="meta_title" value={config?.meta_title || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Meta Description</label>
                <textarea name="meta_description" rows="3" value={config?.meta_description || ''} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Meta Keywords</label>
                <input type="text" name="meta_keywords" value={config?.meta_keywords || ''} onChange={handleChange} placeholder="palavra1, palavra2, palavra3" />
              </div>
              <div className="form-group">
                <label>Cor Primária</label>
                <input type="color" name="cor_primaria" value={config?.cor_primaria || '#00adb5'} onChange={handleChange} />
                <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>{config?.cor_primaria || '#00adb5'}</span>
              </div>
              <div className="form-group">
                <label>Cor Secundária</label>
                <input type="color" name="cor_secundaria" value={config?.cor_secundaria || '#c70039'} onChange={handleChange} />
                <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>{config?.cor_secundaria || '#c70039'}</span>
              </div>
              <div className="form-group">
                <label>Cor do Texto</label>
                <input type="color" name="cor_texto" value={config?.cor_texto || '#333333'} onChange={handleChange} />
                <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>{config?.cor_texto || '#333333'}</span>
              </div>
              <button className="btn-salvar" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}

        {/* ABA NOSSA HISTÓRIA */}
        {activeTab === 'historia' && (
          <div className="admin-section">
            <h2>Nossa História</h2>
            <div className="admin-form">
              <div className="form-group">
                <label>Título</label>
                <input type="text" name="historia_titulo" value={config?.historia_titulo || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Conteúdo</label>
                <textarea name="historia_conteudo" rows="8" value={config?.historia_conteudo || ''} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Ano de Fundação</label>
                <input type="text" name="historia_fundacao" value={config?.historia_fundacao || ''} onChange={handleChange} />
              </div>
              <button className="btn-salvar" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
