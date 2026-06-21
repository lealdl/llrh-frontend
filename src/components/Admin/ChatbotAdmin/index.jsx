import { useState, useEffect } from 'react';
import './ChatbotAdmin.css';

const ChatbotAdmin = () => {
    const [stats, setStats] = useState(null);
    const [topQuestions, setTopQuestions] = useState([]);
    const [history, setHistory] = useState([]);
    const [allSessions, setAllSessions] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats');
    const [sessaoId, setSessaoId] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState('todos');

    // ========== STATES PARA DELETAR ==========
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState('');
    const [deleteType, setDeleteType] = useState('usuario');
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api-llrh';

    const getToken = () => localStorage.getItem('token');

    // ========== TOAST ==========
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ========== CARREGAR ESTATÍSTICAS ==========
    const carregarStats = async () => {
        try {
            const token = getToken();
            if (!token) {
                setError('Usuário não autenticado');
                setLoading(false);
                return;
            }
            const response = await fetch(`${API_URL}/admin/chatbot/estatisticas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) {
                setError('Sessão expirada. Faça login novamente.');
                setLoading(false);
                return;
            }
            if (!response.ok) throw new Error('Erro ao carregar estatísticas');
            const data = await response.json();
            if (data.error) {
                setError(data.error);
                setLoading(false);
                return;
            }
            setStats(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ========== CARREGAR TOP PERGUNTAS ==========
    const carregarTopQuestions = async () => {
        try {
            const token = getToken();
            if (!token) return;
            const response = await fetch(`${API_URL}/admin/chatbot/top-perguntas?limit=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) {
                setError('Sessão expirada. Faça login novamente.');
                return;
            }
            if (!response.ok) throw new Error('Erro ao carregar perguntas');
            const data = await response.json();
            if (data.error) {
                setError(data.error);
                return;
            }
            setTopQuestions(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        }
    };

    // ========== CARREGAR LISTA DE USUÁRIOS ==========
    const carregarUsuarios = async () => {
        try {
            const token = getToken();
            if (!token) return;

            const response = await fetch(`${API_URL}/admin/chatbot/usuarios`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Erro ao carregar usuários');
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                const sorted = data.sort((a, b) => b.total_mensagens - a.total_mensagens);
                setUsuarios(sorted);

                if (sorted.length > 0) {
                    setSelectedUsuario(sorted[0].usuario_nome);
                    await carregarMensagensPorUsuario(sorted[0].usuario_nome);
                }
            } else {
                await carregarUltimasMensagens();
            }
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
            await carregarUltimasMensagens();
        }
    };

    // ========== CARREGAR MENSAGENS POR USUÁRIO ==========
    const carregarMensagensPorUsuario = async (usuario) => {
        setLoadingHistory(true);
        try {
            const token = getToken();
            if (!token) return;

            let url;
            if (usuario === 'todos') {
                url = `${API_URL}/admin/chatbot/ultimas?limit=100`;
            } else {
                url = `${API_URL}/admin/chatbot/mensagens/usuario/${encodeURIComponent(usuario)}?limit=100`;
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Erro ao carregar mensagens');
            const data = await response.json();

            if (Array.isArray(data)) {
                setHistory(data);
                setSearchResult(usuario === 'todos' ? 'Todos os visitantes' : usuario);
                setError(null);
            } else {
                setHistory([]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingHistory(false);
        }
    };

    // ========== CARREGAR ÚLTIMAS MENSAGENS ==========
    const carregarUltimasMensagens = async () => {
        setLoadingHistory(true);
        try {
            const token = getToken();
            if (!token) return;

            const response = await fetch(`${API_URL}/admin/chatbot/ultimas?limit=100`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Erro ao carregar últimas mensagens');
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                setHistory(data);
                setSearchResult('Últimas 100 mensagens');
                setError(null);
            } else {
                setHistory([]);
                setSearchResult('Nenhuma mensagem encontrada');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingHistory(false);
        }
    };

    // ========== BUSCAR POR SESSÃO ==========
    const buscarSessao = async () => {
        if (!sessaoId.trim()) {
            setError('Digite um ID de sessão');
            return;
        }
        setLoadingHistory(true);
        try {
            const token = getToken();
            if (!token) return;

            const response = await fetch(`${API_URL}/admin/chatbot/historico/${sessaoId.trim()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Erro ao carregar histórico');
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                setHistory(data);
                setSearchResult(`Sessão: ${sessaoId}`);
                setError(null);
            } else {
                setHistory([]);
                setSearchResult('Nenhuma mensagem encontrada para esta sessão');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingHistory(false);
        }
    };

    // ========== DELETAR MENSAGENS ==========
    const confirmarDelecao = () => {
        // Fecha o modal de seleção e abre o de confirmação
        setShowConfirmModal(true);
    };

    const executarDelecao = async () => {
        setDeleting(true);
        try {
            const token = getToken();
            if (!token) return;

            let url = '';
            let body = {};

            if (deleteType === 'todas') {
                url = `${API_URL}/admin/chatbot/deletar/todas`;
            } else if (deleteType === 'usuario') {
                if (!deleteTarget) {
                    showToast('Selecione um usuário', 'error');
                    setDeleting(false);
                    return;
                }
                url = `${API_URL}/admin/chatbot/deletar/usuario`;
                body = { usuario: deleteTarget };
            } else if (deleteType === 'sessao') {
                if (!deleteTarget) {
                    showToast('Selecione uma sessão', 'error');
                    setDeleting(false);
                    return;
                }
                url = `${API_URL}/admin/chatbot/deletar/sessao`;
                body = { sessao_id: deleteTarget };
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (data.success) {
                showToast(`✅ ${data.message}`, 'success');
                setShowDeleteModal(false);
                setShowConfirmModal(false);
                // Recarregar todos os dados
                await carregarTudo();
                if (activeTab === 'history') {
                    await carregarUsuarios();
                }
            } else {
                showToast(`❌ ${data.error || 'Erro ao deletar'}`, 'error');
            }
        } catch (err) {
            showToast(`❌ Erro: ${err.message}`, 'error');
        } finally {
            setDeleting(false);
        }
    };

    // ========== CARREGAR TUDO ==========
    const carregarTudo = async () => {
        setLoading(true);
        setError(null);
        await Promise.all([carregarStats(), carregarTopQuestions()]);
        await carregarUsuarios();
        setLoading(false);
    };

    useEffect(() => {
        carregarTudo();
    }, []);

    if (loading && !stats) {
        return <div className="chatbot-admin-loading">🔄 Carregando dados do chatbot...</div>;
    }

    return (
        <div className="chatbot-admin">
            {/* ===== TOAST ===== */}
            {toast && (
                <div className={`chatbot-toast ${toast.type}`}>
                    <span>{toast.message}</span>
                    <button className="toast-close" onClick={() => setToast(null)}>×</button>
                </div>
            )}

            <div className="chatbot-admin-header">
                <h2>💬 Chatbot - Administração</h2>
                <div className="header-actions">
                    <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
                        🗑️ Deletar Mensagens
                    </button>
                    <button className="refresh-btn" onClick={carregarTudo}>🔄 Atualizar</button>
                </div>
            </div>

            {error && (
                <div className="chatbot-error">
                    ❌ {error}
                    {error.includes('Sessão expirada') && (
                        <button
                            onClick={() => window.location.href = '/?admin=true'}
                            style={{ marginLeft: '12px', padding: '4px 12px', borderRadius: '4px', border: 'none', background: '#667eea', color: 'white', cursor: 'pointer' }}
                        >
                            🔐 Fazer login novamente
                        </button>
                    )}
                </div>
            )}

            {/* ===== ABAS ===== */}
            <div className="chatbot-admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    📊 Estatísticas
                </button>
                <button
                    className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('questions')}
                >
                    📋 Perguntas Frequentes
                </button>
                <button
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    📜 Histórico
                </button>
            </div>

            {/* ===== ABA: ESTATÍSTICAS ===== */}
            {activeTab === 'stats' && stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-icon">💬</span>
                        <div>
                            <div className="stat-label">Total Conversas</div>
                            <div className="stat-value">{stats.total_conversas || 0}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">👥</span>
                        <div>
                            <div className="stat-label">Sessões Únicas</div>
                            <div className="stat-value">{stats.total_sessoes || 0}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">👤</span>
                        <div>
                            <div className="stat-label">Mensagens Usuário</div>
                            <div className="stat-value">{stats.total_mensagens_user || 0}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🤖</span>
                        <div>
                            <div className="stat-label">Mensagens Bot</div>
                            <div className="stat-value">{stats.total_mensagens_bot || 0}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">✅</span>
                        <div>
                            <div className="stat-label">Conversas Encerradas</div>
                            <div className="stat-value">{stats.total_encerradas || 0}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">📈</span>
                        <div>
                            <div className="stat-label">Taxa de Encerramento</div>
                            <div className="stat-value">
                                {stats.total_conversas > 0
                                    ? Math.round((stats.total_encerradas / stats.total_conversas) * 100)
                                    : 0}%
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== ABA: PERGUNTAS FREQUENTES ===== */}
            {activeTab === 'questions' && (
                <div className="questions-section">
                    <h3>📋 Perguntas Mais Frequentes</h3>
                    {topQuestions.length === 0 ? (
                        <p className="empty-message">📭 Nenhuma pergunta registrada ainda</p>
                    ) : (
                        <table className="questions-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Pergunta</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topQuestions.map((q, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{q.mensagem}</td>
                                        <td><span className="question-count">{q.total}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ===== ABA: HISTÓRICO ===== */}
            {activeTab === 'history' && (
                <div className="history-section">
                    <h3>📜 Histórico de Conversas</h3>

                    {usuarios.length > 0 && (
                        <div className="usuarios-dropdown">
                            <label>👤 Selecione um visitante:</label>
                            <select
                                value={selectedUsuario}
                                onChange={(e) => {
                                    setSelectedUsuario(e.target.value);
                                    carregarMensagensPorUsuario(e.target.value);
                                }}
                            >
                                <option value="todos">📋 Todos os visitantes</option>
                                {usuarios.map((user) => (
                                    <option key={user.usuario_nome} value={user.usuario_nome}>
                                        {user.usuario_nome} ({user.total_mensagens} msgs)
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Digite o ID da sessão (ex: teste123)"
                            value={sessaoId}
                            onChange={(e) => setSessaoId(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && buscarSessao()}
                        />
                        <button onClick={buscarSessao} disabled={loadingHistory}>
                            {loadingHistory ? '🔍 Buscando...' : '🔍 Buscar'}
                        </button>
                    </div>

                    {searchResult && (
                        <div className="history-result">
                            <h4>
                                {searchResult === 'Últimas 100 mensagens'
                                    ? '📋 Últimas 100 mensagens'
                                    : searchResult === 'Todos os visitantes'
                                        ? '📋 Todas as conversas'
                                        : searchResult === 'Nenhuma mensagem encontrada'
                                            ? '📭 Nenhuma mensagem encontrada'
                                            : `👤 ${searchResult}`}
                                {history.length > 0 && searchResult !== 'Nenhuma mensagem encontrada' && (
                                    <span className="message-count"> ({history.length} mensagens)</span>
                                )}
                            </h4>

                            {loadingHistory ? (
                                <div className="loading-history">🔄 Carregando mensagens...</div>
                            ) : history.length === 0 ? (
                                <p className="empty-message">📭 Nenhuma mensagem encontrada</p>
                            ) : (
                                <div className="messages-list">
                                    {history.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`message-item ${msg.tipo === 'user' ? 'msg-user' : 'msg-bot'}`}
                                        >
                                            <div className="message-header">
                                                <span className="message-type">
                                                    {msg.tipo === 'user' ? '👤' : '🤖'}
                                                    {msg.usuario_nome ? ` ${msg.usuario_nome}` : ' Visitante'}
                                                </span>
                                                <span className="message-time">{msg.data_criacao}</span>
                                            </div>
                                            <div className="message-text">{msg.mensagem}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ===== MODAL DE SELEÇÃO ===== */}
            {showDeleteModal && (
                <div className="delete-modal-overlay" onClick={() => { setShowDeleteModal(false); setShowConfirmModal(false); }}>
                    <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-header">
                            <h3>🗑️ Deletar Mensagens</h3>
                            <button className="delete-modal-close" onClick={() => { setShowDeleteModal(false); setShowConfirmModal(false); }}>×</button>
                        </div>

                        <div className="delete-modal-body">
                            <div className="delete-type-selector">
                                <button
                                    className={`delete-type-btn ${deleteType === 'usuario' ? 'active' : ''}`}
                                    onClick={() => {
                                        setDeleteType('usuario');
                                        setDeleteTarget('');
                                    }}
                                >
                                    👤 Por Usuário
                                </button>
                                <button
                                    className={`delete-type-btn ${deleteType === 'sessao' ? 'active' : ''}`}
                                    onClick={() => {
                                        setDeleteType('sessao');
                                        setDeleteTarget('');
                                    }}
                                >
                                    📋 Por Sessão
                                </button>
                                <button
                                    className={`delete-type-btn ${deleteType === 'todas' ? 'active' : ''}`}
                                    onClick={() => {
                                        setDeleteType('todas');
                                        setDeleteTarget('');
                                    }}
                                >
                                    🗑️ Todas
                                </button>
                            </div>

                            {deleteType === 'usuario' && (
                                <div className="delete-select-group">
                                    <label>Selecione um usuário:</label>
                                    <select
                                        value={deleteTarget}
                                        onChange={(e) => setDeleteTarget(e.target.value)}
                                    >
                                        <option value="">-- Selecione --</option>
                                        {usuarios.map((user) => (
                                            <option key={user.usuario_nome} value={user.usuario_nome}>
                                                {user.usuario_nome} ({user.total_mensagens} mensagens)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {deleteType === 'sessao' && (
                                <div className="delete-select-group">
                                    <label>Selecione uma sessão:</label>
                                    <select
                                        value={deleteTarget}
                                        onChange={(e) => setDeleteTarget(e.target.value)}
                                    >
                                        <option value="">-- Selecione --</option>
                                        {allSessions.map((sessao) => (
                                            <option key={sessao.sessao_id} value={sessao.sessao_id}>
                                                {sessao.sessao_id} ({sessao.total_mensagens} mensagens)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {deleteType === 'todas' && (
                                <div className="delete-warning-all">
                                    <p>⚠️ <strong>Todas as mensagens</strong> do chatbot serão deletadas permanentemente!</p>
                                    <p style={{ color: '#dc2626', fontWeight: 'bold' }}>Esta ação não pode ser desfeita!</p>
                                </div>
                            )}
                        </div>

                        <div className="delete-modal-footer">
                            <button className="delete-cancel-btn" onClick={() => { setShowDeleteModal(false); setShowConfirmModal(false); }}>
                                Cancelar
                            </button>
                            <button
                                className="delete-confirm-btn"
                                onClick={confirmarDelecao}
                                disabled={deleteType !== 'todas' && !deleteTarget}
                            >
                                🗑️ Deletar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== MODAL DE CONFIRMAÇÃO ===== */}
            {showConfirmModal && (
                <div className="confirm-modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-modal-icon">⚠️</div>
                        <h3>Confirmar Deleção</h3>
                        <p>
                            {deleteType === 'todas' && 'Todas as mensagens do chatbot serão deletadas permanentemente!'}
                            {deleteType === 'usuario' && `Todas as mensagens de "${deleteTarget}" serão deletadas permanentemente!`}
                            {deleteType === 'sessao' && `Todas as mensagens da sessão "${deleteTarget}" serão deletadas permanentemente!`}
                        </p>
                        <p className="confirm-warning">Esta ação não pode ser desfeita!</p>
                        <div className="confirm-modal-footer">
                            <button className="confirm-cancel-btn" onClick={() => setShowConfirmModal(false)}>
                                Cancelar
                            </button>
                            <button
                                className={`confirm-delete-btn ${deleting ? 'loading' : ''}`}
                                onClick={executarDelecao}
                                disabled={deleting}
                            >
                                {deleting ? '🔄 Deletando...' : '✅ Confirmar Deleção'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotAdmin;