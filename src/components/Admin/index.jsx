import { useState, useEffect, useRef } from 'react';
import { getConfiguracoes, updateConfiguracoes } from '../../services/api';
import RichTextEditor from './RichTextEditor';
import ServicosAdmin from './Servicos';
import ContatoAdmin from './Contato';
import VagasAdmin from './Vagas';
import DesenvolvedorAdmin from './Desenvolvedor';
import './admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api-llrh';
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('geral');
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [uploading, setUploading] = useState(false);
    const toastTimeoutRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);

    useEffect(() => {
        carregarConfiguracoes();
    }, []);

    const carregarConfiguracoes = async () => {
        try {
            const response = await getConfiguracoes();
            if (response.success && response.data) {
                setConfig(response.data);
                // Forçar recriação do editor após carregar dados
                setEditorKey(prev => prev + 1);
            }
        } catch (error) {
            console.error('Erro:', error);
            showMessage('Erro ao carregar configurações', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (text, type) => {
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        setMessage(text);
        setMessageType(type);
        toastTimeoutRef.current = setTimeout(() => {
            setMessage(null);
            setMessageType('');
        }, 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleRichTextChange = (name, value) => {
        console.log(`📝 ${name} alterado:`, value);
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (tipo, file) => {
        const formData = new FormData();
        formData.append('imagem', file);
        
        setUploading(true);
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/upload/imagem/${tipo}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                let campo = '';
                switch (tipo) {
                    case 'logo': campo = 'logo_url'; break;
                    case 'hero': campo = 'logo_hero_url'; break;
                    case 'historia': campo = 'historia_imagem'; break;
                    case 'contato': campo = 'contato_imagem'; break;
                    default: campo = `${tipo}_url`;
                }
                
                const novaUrl = `${IMAGE_BASE_URL}${data.path}?t=${Date.now()}`;
                setConfig(prev => ({ ...prev, [campo]: novaUrl }));
                showMessage(`✅ Imagem ${tipo} enviada com sucesso!`, 'success');
                
                if (tipo === 'hero') window.dispatchEvent(new Event('heroImageUpdated'));
                if (tipo === 'historia') window.dispatchEvent(new Event('historiaUpdated'));
                if (tipo === 'logo') window.dispatchEvent(new Event('logoUploaded'));
                if (tipo === 'contato') window.dispatchEvent(new Event('contatoImageUpdated'));
            } else {
                showMessage(data.error || 'Erro ao enviar imagem', 'error');
            }
        } catch (error) {
            showMessage('Erro de conexão', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        console.log('📤 Enviando configurações:', config);

        try {
            const result = await updateConfiguracoes(config);
            console.log('📥 Resposta do servidor:', result);
            if (result.success) {
                showMessage('✅ Configurações salvas com sucesso!', 'success');
            } else {
                showMessage(result.message || '❌ Erro ao salvar configurações', 'error');
            }
        } catch (error) {
            console.error('❌ Erro:', error);
            showMessage('❌ Erro de conexão com o servidor', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-loading">Carregando...</div>;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'geral':
                return (
                    <div className="tab-content">
                        <div className="form-section">
                            <h2>Hero</h2>
                            <div className="form-group"><label>Hero Título</label><input type="text" name="hero_titulo" value={config?.hero_titulo || ""} onChange={handleChange} /></div>
                            <div className="form-group"><label>Hero Descrição</label>
                                <RichTextEditor 
                                    key={`hero_descricao_${editorKey}`}
                                    value={config?.hero_descricao || ''} 
                                    onChange={(html) => handleRichTextChange('hero_descricao', html)} 
                                    placeholder="Digite a descrição do Hero..." 
                                />
                            </div>
                            
                            <h2>Informações da Empresa</h2>
                            <div className="form-group"><label>Nome do Site</label><input type="text" name="nome_site" value={config?.nome_site || ''} onChange={handleChange} /></div>
                            <div className="form-group"><label>Email de Contato</label><input type="email" name="email_contato" value={config?.email_contato || ''} onChange={handleChange} /></div>
                            <div className="form-group"><label>Telefone</label><input type="text" name="telefone" value={config?.telefone || ''} onChange={handleChange} /></div>
                            <div className="form-group"><label>WhatsApp</label><input type="text" name="whatsapp" value={config?.whatsapp || ''} onChange={handleChange} /></div>
                            <div className="form-group"><label>Endereço</label><textarea name="endereco" rows="3" value={config?.endereco || ''} onChange={handleChange} /></div>
                        </div>
                    </div>
                );
            case 'redes':
                return (
                    <div className="tab-content">
                        <div className="form-section">
                            <h2>Redes Sociais</h2>
                            <div className="form-group"><label>Facebook</label><input type="url" name="facebook" value={config?.facebook || ''} onChange={handleChange} /></div>
                            <div className="form-group"><label>Instagram</label><input type="url" name="instagram" value={config?.instagram || ''} onChange={handleChange} /></div>
                            <div className="form-group"><label>LinkedIn</label><input type="url" name="linkedin" value={config?.linkedin || ''} onChange={handleChange} /></div>
                        </div>
                    </div>
                );
            case 'sobre':
                return (
                    <div className="tab-content">
                        <div className="form-section">
                            <h2>Seção Sobre</h2>
                            <div className="form-group"><label>Título</label><input type="text" name="sobre_titulo" value={config?.sobre_titulo || 'Sobre a LLRH'} onChange={handleChange} /></div>
                            <div className="form-group"><label>Conteúdo Principal</label>
                                <RichTextEditor 
                                    key={`sobre_conteudo_${editorKey}`}
                                    value={config?.sobre_conteudo || ''} 
                                    onChange={(html) => handleRichTextChange('sobre_conteudo', html)} 
                                    placeholder="Digite o conteúdo..." 
                                />
                            </div>
                            <div className="form-group"><label>Missão</label>
                                <RichTextEditor 
                                    key={`sobre_missao_${editorKey}`}
                                    value={config?.sobre_missao || ''} 
                                    onChange={(html) => handleRichTextChange('sobre_missao', html)} 
                                    placeholder="Digite a missão..." 
                                />
                            </div>
                            <div className="form-group"><label>Visão</label>
                                <RichTextEditor 
                                    key={`sobre_visao_${editorKey}`}
                                    value={config?.sobre_visao || ''} 
                                    onChange={(html) => handleRichTextChange('sobre_visao', html)} 
                                    placeholder="Digite a visão..." 
                                />
                            </div>
                            <div className="form-group"><label>Valores</label>
                                <RichTextEditor 
                                    key={`sobre_valores_${editorKey}`}
                                    value={config?.sobre_valores || ''} 
                                    onChange={(html) => handleRichTextChange('sobre_valores', html)} 
                                    placeholder="Digite os valores..." 
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'servicos':
                return <ServicosAdmin />;
            case 'contato':
                return <ContatoAdmin config={config} onConfigUpdate={handleRichTextChange} showMessage={showMessage} />;
            case 'vagas':
                return <VagasAdmin />;
            case 'imagens':
                return (
                    <div className="tab-content">
                        <div className="form-section">
                            <h2>Upload de Imagens</h2>
                            <div className="form-group image-upload-group"><label>Logo</label><div className="image-upload-area"><input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e.target.files[0])} disabled={uploading} />{config?.logo_url && <div className="image-preview-mini"><img src={config.logo_url} alt="Logo" /></div>}</div></div>
                            <div className="form-group image-upload-group"><label>Hero</label><div className="image-upload-area"><input type="file" accept="image/*" onChange={(e) => handleImageUpload('hero', e.target.files[0])} disabled={uploading} />{config?.logo_hero_url && <div className="image-preview-mini"><img src={config.logo_hero_url} alt="Hero" /></div>}</div></div>
                            <div className="form-group image-upload-group"><label>História</label><div className="image-upload-area"><input type="file" accept="image/*" onChange={(e) => handleImageUpload('historia', e.target.files[0])} disabled={uploading} />{config?.historia_imagem && <div className="image-preview-mini"><img src={config.historia_imagem} alt="História" /></div>}</div></div>
                            {uploading && <div className="upload-loading">Enviando...</div>}
                        </div>
                    </div>
                );
            case 'seo':
                return (
                    <div className="tab-content">
                        <div className="form-section">
                            <h2>SEO</h2>
                            <div className="form-group"><label>Meta Title</label><input type="text" name="meta_title" value={config?.meta_title || ''} onChange={handleChange} /></div>
                            <div className="form-group"><label>Meta Description</label><textarea name="meta_description" rows="3" value={config?.meta_description || ''} onChange={handleChange} /></div>
                            <div className="form-group"><label>Meta Keywords</label><input type="text" name="meta_keywords" value={config?.meta_keywords || ''} onChange={handleChange} /></div>
                        </div>
                    </div>
                );
            case 'historia':
                return (
                    <div className="tab-content">
                        <div className="form-section">
                            <h2>📖 Nossa História</h2>
                            
                            <div className="historia-grid">
                                <div className="form-group">
                                    <label>Título</label>
                                    <input 
                                        type="text" 
                                        name="historia_titulo" 
                                        value={config?.historia_titulo || 'Nossa História'} 
                                        onChange={handleChange} 
                                        className="form-control" 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Ano de Fundação</label>
                                    <input 
                                        type="text" 
                                        name="historia_fundacao" 
                                        value={config?.historia_fundacao || '2020'} 
                                        onChange={handleChange} 
                                        className="form-control" 
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Conteúdo da História</label>
                                <RichTextEditor 
                                    key={`historia_conteudo_${editorKey}`}
                                    value={config?.historia_conteudo || ''} 
                                    onChange={(html) => handleRichTextChange('historia_conteudo', html)} 
                                    placeholder="Digite a história da empresa aqui. Use as ferramentas de formatação para deixar o texto mais rico..." 
                                />
                            </div>
                            
                            {config?.historia_conteudo && (
                                <div className="historia-preview">
                                    <h3>👁️ Preview do conteúdo (como ficará no site)</h3>
                                    <div 
                                        className="historia-preview-content" 
                                        dangerouslySetInnerHTML={{ __html: config.historia_conteudo }} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'desenvolvedor':
                const devToken = localStorage.getItem('devToken');
                const devUser = localStorage.getItem('devUser');
                if (!devToken || !devUser) {
                    window.location.href = '/?dev=true';
                    return <div className="dev-loading">Redirecionando para login...</div>;
                }
                return <DesenvolvedorAdmin />;
            default:
                return null;
        }
    };

    const isDevTab = activeTab === 'desenvolvedor';

    return (
        <div className="admin-container">
            {message && (
                <div className={`admin-toast ${messageType}`}>
                    <div className="toast-content">
                        <span className="toast-message">{message}</span>
                    </div>
                    <button className="toast-close" onClick={() => setMessage(null)}>×</button>
                </div>
            )}
            
            <div className="admin-tabs">
                <button className={`tab-btn ${activeTab === 'geral' ? 'active' : ''}`} onClick={() => setActiveTab('geral')}>Informações Gerais</button>
                <button className={`tab-btn ${activeTab === 'redes' ? 'active' : ''}`} onClick={() => setActiveTab('redes')}>Redes Sociais</button>
                <button className={`tab-btn ${activeTab === 'sobre' ? 'active' : ''}`} onClick={() => setActiveTab('sobre')}>Sobre</button>
                <button className={`tab-btn ${activeTab === 'servicos' ? 'active' : ''}`} onClick={() => setActiveTab('servicos')}>Serviços</button>
                <button className={`tab-btn ${activeTab === 'contato' ? 'active' : ''}`} onClick={() => setActiveTab('contato')}>Contato</button>
                <button className={`tab-btn ${activeTab === 'vagas' ? 'active' : ''}`} onClick={() => setActiveTab('vagas')}>Vagas</button>
                <button className={`tab-btn ${activeTab === 'imagens' ? 'active' : ''}`} onClick={() => setActiveTab('imagens')}>Imagens</button>
                <button className={`tab-btn ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}>SEO</button>
                <button className={`tab-btn ${activeTab === 'historia' ? 'active' : ''}`} onClick={() => setActiveTab('historia')}>Nossa História</button>
                <button className={`tab-btn ${activeTab === 'desenvolvedor' ? 'active' : ''}`} onClick={() => setActiveTab('desenvolvedor')}>👨‍💻 Desenvolvedor</button>
            </div>
            
            {isDevTab ? (
                <div className="admin-form">
                    {renderTabContent()}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="admin-form">
                    {renderTabContent()}
                    <div className="form-actions">
                        <button type="submit" disabled={saving}>
                            {saving ? '💾 Salvando...' : '💾 Salvar Todas as Configurações'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AdminDashboard;
