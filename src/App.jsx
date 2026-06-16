import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Sobre from './components/Sobre'
import Historia from './components/Historia'
import Servicos from './components/Servicos'
import Vagas from './components/Vagas'
import Contato from './components/Contato'
import Footer from './components/Footer'
import AdminDashboard from './components/Admin'
import Login from './components/Login'
import './css/global.css'

function App() {
  const [mostrarBotaoTopo, setMostrarBotaoTopo] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setMostrarBotaoTopo(true)
      else setMostrarBotaoTopo(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      setIsAuthenticated(true)
    }
    setLoadingAuth(false)
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    window.location.href = '/'
  }

  const params = new URLSearchParams(window.location.search)
  const isAdminRoute = params.get('admin') === 'true'

  if (loadingAuth) {
    return <div className="app">Carregando...</div>
  }

  // Tela de login (se tentar acessar admin sem estar logado)
  if (isAdminRoute && !isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // Dashboard admin (se estiver autenticado e na rota admin)
  if (isAdminRoute && isAuthenticated) {
    return (
      <div className="app">
        <Header onLogout={handleLogout} />
        <main style={{ paddingTop: '80px' }}>
          <AdminDashboard />
        </main>
        <Footer />
        {mostrarBotaoTopo && (
          <button className="btn-topo" onClick={scrollToTop}>↑</button>
        )}
      </div>
    )
  }

  // Site público (rota normal)
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Historia />
        <Servicos />
        <Vagas />
        <Contato />
      </main>
      <Footer />
      {mostrarBotaoTopo && (
        <button className="btn-topo" onClick={scrollToTop}>↑</button>
      )}
    </div>
  )
}

export default App
