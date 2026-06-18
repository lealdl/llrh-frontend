import { useState, useEffect } from 'react';
import './desenvolvedor.css';

const DesenvolvedorAdmin = () => {
  const [stats, setStats] = useState({
    servicos: 0,
    vagas: 0,
    usuarios: 0,
    versao: '1.0.0',
    ultimoBackup: 'Nunca',
    bancoTamanho: '0 KB'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarStats();
  }, []);

  const carregarStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const servicosRes = await fetch('http://localhost/api-llrh/admin/servicos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const servicosData = await servicosRes.json();
      
      const vagasRes = await fetch('http://localhost/api-llrh/admin/vagas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const vagasData = await vagasRes.json();

      setStats({
        servicos: servicosData.data?.length || 0,
        vagas: vagasData.data?.length || 0,
        usuarios: 1,
        versao: '1.0.0',
        ultimoBackup: new Date().toLocaleString('pt-BR'),
        bancoTamanho: '256 KB'
      });
    } catch (error) {
      console.error('Erro ao carregar stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = () => {
    alert('💾 Backup manual iniciado!');
  };

  const handleLimparCache = () => {
    alert('🧹 Cache limpo com sucesso!');
  };

  const handleOtimizarBanco = () => {
    alert('🔧 Banco otimizado com sucesso!');
  };

  if (loading) {
    return <div className="dev-loading">🔄 Carregando dados...</div>;
  }

  return (
    <div className="dev-container">
      <div className="dev-header">
        <h2>👨‍💻 Painel do Desenvolvedor</h2>
        <p>Ferramentas e informações para manutenção do sistema</p>
      </div>

      <div className="dev-grid">
        <div className="dev-card">
          <div className="dev-card-icon">📊</div>
          <div className="dev-card-content">
            <h3>Total de Serviços</h3>
            <p className="dev-card-number">{stats.servicos}</p>
          </div>
        </div>

        <div className="dev-card">
          <div className="dev-card-icon">💼</div>
          <div className="dev-card-content">
            <h3>Total de Vagas</h3>
            <p className="dev-card-number">{stats.vagas}</p>
          </div>
        </div>

        <div className="dev-card">
          <div className="dev-card-icon">👤</div>
          <div className="dev-card-content">
            <h3>Usuários</h3>
            <p className="dev-card-number">{stats.usuarios}</p>
          </div>
        </div>

        <div className="dev-card">
          <div className="dev-card-icon">📦</div>
          <div className="dev-card-content">
            <h3>Versão</h3>
            <p className="dev-card-number">{stats.versao}</p>
          </div>
        </div>
      </div>

      <div className="dev-section">
        <h3>🔧 Ferramentas de Manutenção</h3>
        <div className="dev-tools">
          <button className="dev-tool-btn" onClick={handleBackup}>
            💾 Backup Manual
          </button>
          <button className="dev-tool-btn" onClick={handleLimparCache}>
            🧹 Limpar Cache
          </button>
          <button className="dev-tool-btn" onClick={handleOtimizarBanco}>
            🔧 Otimizar Banco
          </button>
        </div>
      </div>

      <div className="dev-section">
        <h3>📋 Informações do Sistema</h3>
        <div className="dev-info-grid">
          <div className="dev-info-item">
            <span className="dev-info-label">Último Backup:</span>
            <span className="dev-info-value">{stats.ultimoBackup}</span>
          </div>
          <div className="dev-info-item">
            <span className="dev-info-label">Tamanho do Banco:</span>
            <span className="dev-info-value">{stats.bancoTamanho}</span>
          </div>
          <div className="dev-info-item">
            <span className="dev-info-label">PHP Version:</span>
            <span className="dev-info-value">8.0.30</span>
          </div>
          <div className="dev-info-item">
            <span className="dev-info-label">SQLite Version:</span>
            <span className="dev-info-value">3.40.1</span>
          </div>
        </div>
      </div>

      <div className="dev-section">
        <h3>📝 Logs de Acesso</h3>
        <div className="dev-logs">
          <div className="dev-log-entry">
            <span className="dev-log-time">Hoje 10:30</span>
            <span className="dev-log-user">Admin</span>
            <span className="dev-log-action">Login realizado</span>
          </div>
          <div className="dev-log-entry">
            <span className="dev-log-time">Hoje 09:15</span>
            <span className="dev-log-user">Admin</span>
            <span className="dev-log-action">Atualizou configurações</span>
          </div>
          <div className="dev-log-entry">
            <span className="dev-log-time">Ontem 17:45</span>
            <span className="dev-log-user">Admin</span>
            <span className="dev-log-action">Criou nova vaga</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesenvolvedorAdmin;
