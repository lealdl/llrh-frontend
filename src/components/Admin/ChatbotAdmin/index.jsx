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
    const [filteredSessions, setFilteredSessions] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api-llrh';

    const getToken = () => localStorage.getItem('token');

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
                // Ordenar por quantidade de mensagens
                const sorted = data.sort((a, b) => b.total_mensagens - a.total_mensagens);
                setUsuarios(sorted);

                // Selecionar o primeiro usuário automaticamente
                if (sorted.length > 0) {
                    setSelectedUsuario(sorted[0].usuario_nome);
                    await carregarMensagensPorUsuario(sorted[0].usuario_nome);
                }
            }
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
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

    // ========== CARREGAR TUDO ==========
    const carregarTudo = async () => {
        setLoading(true);
        setError(null);
        await Promise.all([carregarStats(), carregarTopQuestions(), carregarUsuarios()]);
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
            <div className="chatbot-admin-header">
                <h2>💬 Chatbot - Administração</h2>
                <button className="refresh-btn" onClick={carregarTudo}>🔄 Atualizar</button>
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

                    {/* ===== DROPDOWN DE USUÁRIOS ===== */}
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

                    {/* ===== BUSCA POR SESSÃO ===== */}
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

                    {/* ===== RESULTADO ===== */}
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
        </div>
    );
};

export default ChatbotAdmin;