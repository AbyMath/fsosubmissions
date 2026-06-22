import ReactDOM from 'react-dom/client'
import App from './App'
import { AnecdoteProvider } from './hooks'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AnecdoteProvider>
    <App />
  </AnecdoteProvider>
)