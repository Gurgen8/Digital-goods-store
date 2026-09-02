import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./LoginModal.module.css"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleLogin = () => {
    if (login === "admin" && password === "admin") {
      onClose()
      navigate("/admin")
    } else {
      setError(true)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Вход</h2>
        
        {error && <div className={styles.error}>Неверный логин или пароль</div>}
        
        <input 
          className={styles.modalInput} 
          type="text" 
          placeholder="Логин" 
          value={login}
          onChange={e => { setLogin(e.target.value); setError(false); }}
        />
        <input 
          className={styles.modalInput} 
          type="password" 
          placeholder="Пароль" 
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false); }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <button className={styles.modalButton} onClick={handleLogin}>
          Войти
        </button>
      </div>
    </div>
  )
}
