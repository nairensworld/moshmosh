import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  return <p className='font-bold 
  text-3xl bg-amber-800 stroke-amber-50'>{message}</p>
}

export default App
