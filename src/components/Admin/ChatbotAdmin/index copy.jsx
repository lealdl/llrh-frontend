import { useState, useEffect } from 'react';
import './ChatbotAdmin.css';

const ChatbotAdmin = () => {
    const [stats, setStats] = useState(null);
    const [topQuestions, setTopQuestions] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats');
    const [sessaoId, setSessaoId] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState(null);

    // ========== USAR A VARIÁVEL DE AMBIENTE ==========
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api-llrh';

    const getToken = () => localStorage.getItem('token');

    const carregarStats = async () => {
        try {
            const token = getToken();
            if (!token) {
                setError('Usuário não autenticado');
                return;
            }
            const response = await fetch(`${API_URL}/admin/chatbot/estatisticas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Erro ao carregar estatísticas');
            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const carregarTopQuestions = async () => {
        try {
            const token = getToken();
            if (!token) return;
            const response = await fetch(`${API_URL}/admin/chatbot/top-perguntas?limit=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Erro ao carregar perguntas');
            const data = await response.json();
            setTopQuestions(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        }
    };

    const carregarHistorico = async (sessao) => {
        try {
            const token = getToken();
            if (!token) return;
            const response = await fetch(`${API_URL}/admin/chatbot/historico/${sessao}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Erro ao carregar histórico');
            const data = await response.json();
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        }
    };

    const buscarSessao = async () => {
        if (!sessaoId.trim()) {
            setError('Digite um ID de sessão');
            return;
        }
        setLoading(true);
        await carregarHistorico(sessaoId.trim());
        setSearchResult(sessaoId.trim());
        setLoading(false);
    };

    const carregarTudo = async () => {
        setLoading(true);
        setError(null);
        await Promise.all([carregarStats(), carregarTopQuestions()]);
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

            {error && <div className="chatbot-error">{error}</div>}

            {/* Abas */}
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

            {/* Aba: Estatísticas */}
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

            {/* Aba: Perguntas Frequentes */}
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

            {/* Aba: Histórico */}
            {activeTab === 'history' && (
                <div className="history-section">
                    <h3>📜 Buscar Histórico por Sessão</h3>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Digite o ID da sessão (ex: teste123)"
                            value={sessaoId}
                            onChange={(e) => setSessaoId(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && buscarSessao()}
                        />
                        <button onClick={buscarSessao}>🔍 Buscar</button>
                    </div>

                    {searchResult && (
                        <div className="history-result">
                            <h4>Sessão: {searchResult}</h4>
                            {history.length === 0 ? (
                                <p className="empty-message">📭 Nenhuma mensagem encontrada para esta sessão</p>
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
                                                    {msg.usuario_nome ? ` ${msg.usuario_nome}` : ''}
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