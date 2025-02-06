import { useState } from 'react';
// import Header from './components/Header';
import WordleMainComponent from './components/WordleMainComponent';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <div className='container'>
        <WordleMainComponent toggleDarkMode={toggleDarkMode} />
      </div>
    </div>
  );
}

export default App;
