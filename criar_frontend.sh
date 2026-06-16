#!/bin/bash

echo "========================================="
echo "🚀 CRIANDO PROJETO LLRH - FRONTEND"
echo "========================================="

# Entrar no diretório de desenvolvimento
cd ~/Documentos/Development

# Criar projeto React com Vite
echo "📦 Criando projeto React com Vite..."
npm create vite@latest llrh-frontend -- --template react

# Entrar na pasta do projeto
cd llrh-frontend

# Instalar dependências
echo "📦 Instalando dependências..."
npm install
npm install axios react-icons

# Criar estrutura de pastas
echo "📁 Criando estrutura de pastas..."
mkdir -p src/components/{Header,Hero,Sobre,Servicos,Vagas,Contato,Footer}
mkdir -p src/css
mkdir -p src/services

# Criar CSS Global
echo "🎨 Criando CSS Global..."
cat > src/css/global.css << 'GLOBALEOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --color-primary: #2c5f8a;
  --color-primary-dark: #1e3a5f;
  --color-secondary: #e74c3c;
  --color-dark: #1a1a2e;
  --color-gray: #64748b;
  --color-gray-light: #e2e8f0;
  --color-white: #ffffff;
  --color-bg: #f8fafc;
  
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --border-radius-xl: 24px;
  --border-radius-full: 9999px;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  --transition-normal: 300ms ease;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--color-white);
  color: var(--color-dark);
  line-height: 1.5;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-dark);
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: var(--color-primary);
  margin: 0.5rem auto 0;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}
GLOBALEOF

# Criar App.css
cat > src/App.css << 'APPEOF'
.app {
  min-height: 100vh;
}

.btn-topo {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  z-index: 999;
}

.btn-topo:hover {
  background: var(--color-primary-dark);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .btn-topo {
    bottom: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
APPEOF

# Criar main.jsx
cat > src/main.jsx << 'MAINEOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './css/global.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
MAINEOF

# ==================== HEADER ====================
cat > src/components/Header/index.jsx << 'HEADEREOF'
import { useState } from 'react'
import './header.css'

const Header = () => {
  const [menuAberto, setMenuAberto] = useState(false)

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuAberto(false)
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => scrollToSection('hero')}>
          <div className="logo-circle">LLRH</div>
          <span className="logo-text">LLRH - Atração de Talentos</span>
        </div>
        
        <nav className={`nav ${menuAberto ? 'active' : ''}`}>
          <a onClick={() => scrollToSection('hero')}>Início</a>
          <a onClick={() => scrollToSection('sobre')}>Sobre</a>
          <a onClick={() => scrollToSection('servicos')}>Serviços</a>
          <a onClick={() => scrollToSection('vagas')}>Vagas</a>
          <a onClick={() => scrollToSection('contato')}>Contato</a>
        </nav>
        
        <button className="menu-hamburger" onClick={() => setMenuAberto(!menuAberto)}>
          ☰
        </button>
      </div>
    </header>
  )
}

export default Header
HEADEREOF

cat > src/components/Header/header.css << 'HEADERCSSEOF'
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.logo-circle {
  width: 45px;
  height: 45px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.logo-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-dark);
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav a {
  color: var(--color-dark);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: color var(--transition-normal);
}

.nav a:hover {
  color: var(--color-primary);
}

.menu-hamburger {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .nav {
    display: none;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background: white;
    flex-direction: column;
    text-align: center;
    padding: 1rem;
    box-shadow: var(--shadow-md);
  }
  
  .nav.active {
    display: flex;
  }
  
  .nav a {
    padding: 0.5rem;
  }
  
  .menu-hamburger {
    display: block;
  }
}
HEADERCSSEOF

# ==================== HERO ====================
cat > src/components/Hero/index.jsx << 'HEROEOF'
import './hero.css'

const Hero = () => {
  const scrollToContato = () => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="hero">
      <div className="hero-container">
        <div className="hero-card">
          <div className="hero-content">
            <div className="hero-badge">LLRH - ATRAÇÃO DE TALENTOS</div>
            <h1 className="hero-title">
              Conectamos empresas aos profissionais ideais e transformamos carreiras através de soluções inovadoras em Recursos Humanos.
            </h1>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={scrollToContato}>
                Contratar Serviços
              </button>
              <button className="btn-secondary" onClick={scrollToContato}>
                Ver Vagas
              </button>
            </div>
          </div>
          <div className="hero-logo">
            <div className="hero-logo-circle">
              <span>LLRH</span>
              <span>ATRAÇÃO DE TALENTOS</span>
            </div>
          </div>
        </div>
        <div className="hero-footer">
          <span>LLRH</span>
          <span>ATRAÇÃO DE TALENTOS</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
HEROEOF

cat > src/components/Hero/hero.css << 'HEROCSSEOF'
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding-top: 80px;
}

.hero-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-card {
  background: linear-gradient(135deg, #2c5f8a 0%, #1e3a5f 100%);
  border-radius: 32px;
  padding: 3rem;
  display: grid;
  grid-template-columns: 1fr 0.5fr;
  gap: 2rem;
  align-items: center;
}

.hero-badge {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 2px;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 1.5rem;
  color: white;
  line-height: 1.4;
  margin-bottom: 1.5rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.hero-logo-circle {
  background: white;
  border-radius: 50%;
  width: 180px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
}

.hero-logo-circle span:first-child {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c5f8a;
}

.hero-logo-circle span:last-child {
  font-size: 0.7rem;
  color: #64748b;
}

.hero-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .hero-card {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    text-align: center;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .hero-logo-circle {
    width: 150px;
    height: 150px;
  }
}
HEROCSSEOF

# ==================== SOBRE ====================
cat > src/components/Sobre/index.jsx << 'SOBREEOF'
import './sobre.css'

const Sobre = () => {
  return (
    <section id="sobre" className="sobre">
      <div className="container">
        <h2 className="section-title">Sobre a LLRH</h2>
        <div className="sobre-content">
          <p>
            Somos uma empresa especializada em conectar pessoas e organizações por meio de processos 
            seletivos humanizados e estratégicos. Nosso propósito é identificar talentos que façam a 
            diferença, contribuindo para o sucesso e o crescimento sustentável de nossos clientes.
          </p>
          <p>
            Com uma equipe experiente e comprometida, atuamos em todas as etapas da atração, seleção 
            e retenção de profissionais, garantindo o alinhamento entre competências técnicas, 
            comportamentais e culturais.
          </p>
        </div>
        
        <div className="sobre-cards">
          <div className="sobre-card">
            <div className="card-icon">🎯</div>
            <h3>Nossa Missão</h3>
            <p>Transformar o mercado de trabalho através de soluções inovadoras em Recursos Humanos.</p>
          </div>
          <div className="sobre-card">
            <div className="card-icon">👁️</div>
            <h3>Nossa Visão</h3>
            <p>Ser referência em consultoria de talentos reconhecida pela excelência e inovação.</p>
          </div>
          <div className="sobre-card">
            <div className="card-icon">💎</div>
            <h3>Nossos Valores</h3>
            <p>Ética, transparência, inovação e compromisso com o sucesso de clientes e candidatos.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Sobre
SOBREEOF

cat > src/components/Sobre/sobre.css << 'SOBRECSSEOF'
.sobre {
  padding: 5rem 0;
  background: var(--color-white);
}

.sobre-content {
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
}

.sobre-content p {
  color: var(--color-gray);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.sobre-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.sobre-card {
  background: var(--color-bg);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  text-align: center;
  transition: transform var(--transition-normal);
}

.sobre-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.sobre-card h3 {
  margin-bottom: 1rem;
  color: var(--color-dark);
}

.sobre-card p {
  color: var(--color-gray);
  font-size: 0.875rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .sobre-cards {
    grid-template-columns: 1fr;
  }
}
SOBRECSSEOF

# ==================== SERVICOS ====================
cat > src/components/Servicos/index.jsx << 'SERVICOEOF'
import './servicos.css'

const servicosData = [
  { id: 1, icon: "🎯", titulo: "Recrutamento e Seleção", descricao: "Encontre os candidatos ideais para sua empresa com nosso processo seletivo especializado." },
  { id: 2, icon: "🔍", titulo: "Headhunting", descricao: "Busca ativa por profissionais de alto desempenho para posições estratégicas." },
  { id: 3, icon: "📊", titulo: "Avaliação Psicológica", descricao: "Avaliação completa de perfil comportamental e competências técnicas." },
  { id: 4, icon: "💼", titulo: "Consultoria em RH", descricao: "Orientação especializada para melhorar seus processos de gestão de pessoas." },
  { id: 5, icon: "🎓", titulo: "Treinamento e Desenvolvimento", descricao: "Programas customizados para desenvolvimento de competências." },
  { id: 6, icon: "💰", titulo: "Pesquisa Salarial", descricao: "Análise de mercado para definição de faixas salariais competitivas." }
]

const Servicos = () => {
  return (
    <section id="servicos" className="servicos">
      <div className="container">
        <h2 className="section-title">Nossos Serviços</h2>
        <div className="servicos-grid">
          {servicosData.map(servico => (
            <div key={servico.id} className="servico-card">
              <div className="servico-icon">{servico.icon}</div>
              <h3>{servico.titulo}</h3>
              <p>{servico.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Servicos
SERVICOEOF

cat > src/components/Servicos/servicos.css << 'SERVICOCSSEOF'
.servicos {
  padding: 5rem 0;
  background: var(--color-bg);
}

.servicos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.servico-card {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  text-align: center;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-light);
}

.servico-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.servico-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.servico-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--color-dark);
}

.servico-card p {
  color: var(--color-gray);
  line-height: 1.5;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .servicos-grid {
    grid-template-columns: 1fr;
  }
}
SERVICOCSSEOF

# ==================== VAGAS ====================
cat > src/components/Vagas/index.jsx << 'VAGAEOF'
import './vagas.css'

const vagasData = [
  { id: 1, titulo: "Desenvolvedor(a) React Pleno", localizacao: "Remoto", tipo: "CLT", salario: "R$ 7.000 - R$ 9.000" },
  { id: 2, titulo: "Analista de Recursos Humanos Sênior", localizacao: "São Paulo - SP", tipo: "PJ", salario: "R$ 6.000 - R$ 8.000" },
  { id: 3, titulo: "UX/UI Designer", localizacao: "Remoto", tipo: "CLT", salario: "R$ 5.500 - R$ 7.500" }
]

const Vagas = () => {
  return (
    <section id="vagas" className="vagas">
      <div className="container">
        <h2 className="section-title">Vagas em Destaque</h2>
        <div className="vagas-grid">
          {vagasData.map(vaga => (
            <div key={vaga.id} className="vaga-card">
              <div className="vaga-tipo">{vaga.tipo}</div>
              <h3>{vaga.titulo}</h3>
              <div className="vaga-local">📍 {vaga.localizacao}</div>
              <div className="vaga-salario">{vaga.salario}</div>
              <button className="btn-vaga">Candidatar-se →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Vagas
VAGAEOF

cat > src/components/Vagas/vagas.css << 'VAGACSSEOF'
.vagas {
  padding: 5rem 0;
  background: var(--color-white);
}

.vagas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.vaga-card {
  background: white;
  border: 1px solid var(--color-gray-light);
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  position: relative;
  transition: all var(--transition-normal);
}

.vaga-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.vaga-tipo {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(44, 95, 138, 0.1);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.vaga-card h3 {
  margin-bottom: 0.5rem;
  padding-right: 4rem;
}

.vaga-local {
  color: var(--color-gray);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.vaga-salario {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.btn-vaga {
  width: 100%;
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  padding: 0.75rem;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-vaga:hover {
  background: var(--color-primary);
  color: white;
}

@media (max-width: 768px) {
  .vagas-grid {
    grid-template-columns: 1fr;
  }
}
VAGACSSEOF

# ==================== CONTATO ====================
cat > src/components/Contato/index.jsx << 'CONTATOEOF'
import { useState } from 'react'
import './contato.css'

const Contato = () => {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Mensagem enviada! Em breve entraremos em contato.')
    setForm({ nome: '', email: '', mensagem: '' })
  }

  return (
    <section id="contato" className="contato">
      <div className="container">
        <h2 className="section-title">Fale Conosco</h2>
        <div className="contato-wrapper">
          <form className="contato-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Seu nome" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required />
            <input type="email" placeholder="Seu e-mail" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
            <textarea rows="5" placeholder="Sua mensagem" value={form.mensagem} onChange={(e) => setForm({...form, mensagem: e.target.value})} required />
            <button type="submit" className="btn-primary">Enviar Mensagem</button>
          </form>
          <div className="contato-info">
            <h3>Informações</h3>
            <p>📞 (11) 9999-9999</p>
            <p>✉️ contato@llrh.com.br</p>
            <p>📍 Av. Paulista, 1000 - São Paulo, SP</p>
            <p>⏰ Segunda a Sexta: 9h às 18h</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contato
CONTATOEOF

cat > src/components/Contato/contato.css << 'CONTATOCSSEOF'
.contato {
  padding: 5rem 0;
  background: var(--color-bg);
}

.contato-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contato-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contato-form input,
.contato-form textarea {
  padding: 1rem;
  border: 1px solid var(--color-gray-light);
  border-radius: var(--border-radius-md);
  font-family: inherit;
  font-size: 1rem;
}

.contato-form input:focus,
.contato-form textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.contato-info {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.contato-info h3 {
  margin-bottom: 1rem;
}

.contato-info p {
  margin: 0.5rem 0;
  color: var(--color-gray);
}

@media (max-width: 768px) {
  .contato-wrapper {
    grid-template-columns: 1fr;
  }
}
CONTATOCSSEOF

# ==================== FOOTER ====================
cat > src/components/Footer/index.jsx << 'FOOTEREOF'
import './footer.css'

const Footer = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>LLRH</h3>
            <p>ATRAÇÃO DE TALENTOS</p>
          </div>
          <div className="footer-links">
            <a onClick={() => scrollToSection('hero')}>Início</a>
            <a onClick={() => scrollToSection('sobre')}>Sobre</a>
            <a onClick={() => scrollToSection('servicos')}>Serviços</a>
            <a onClick={() => scrollToSection('vagas')}>Vagas</a>
            <a onClick={() => scrollToSection('contato')}>Contato</a>
          </div>
          <div className="footer-social">
            <span>📱 LinkedIn</span>
            <span>📷 Instagram</span>
            <span>👍 Facebook</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 LLRH - Atração de Talentos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
FOOTEREOF

cat > src/components/Footer/footer.css << 'FOOTERCSSEOF'
.footer {
  background: #1a1a2e;
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-logo h3 {
  font-size: 1.5rem;
}

.footer-logo p {
  font-size: 0.7rem;
  opacity: 0.7;
}

.footer-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-links a {
  color: white;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--transition-normal);
}

.footer-links a:hover {
  opacity: 1;
}

.footer-social {
  display: flex;
  gap: 1rem;
}

.footer-social span {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--transition-normal);
}

.footer-social span:hover {
  opacity: 1;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  font-size: 0.875rem;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
FOOTERCSSEOF

# ==================== APP.JSX ====================
cat > src/App.jsx << 'APPJSXEOF'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Sobre from './components/Sobre'
import Servicos from './components/Servicos'
import Vagas from './components/Vagas'
import Contato from './components/Contato'
import Footer from './components/Footer'

function App() {
  const [mostrarBotaoTopo, setMostrarBotaoTopo] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setMostrarBotaoTopo(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <Header />
      <Hero />
      <Sobre />
      <Servicos />
      <Vagas />
      <Contato />
      <Footer />
      {mostrarBotaoTopo && (
        <button className="btn-topo" onClick={scrollToTop}>↑</button>
      )}
    </div>
  )
}

export default App
APPJSXEOF

echo ""
echo "========================================="
echo "✅ FRONTEND CRIADO COM SUCESSO!"
echo "========================================="
echo ""
echo "Para iniciar o projeto, execute:"
echo "cd ~/Documentos/Development/llrh-frontend"
echo "npm run dev"
echo ""
echo "Acesse: http://localhost:5173"
echo "========================================="