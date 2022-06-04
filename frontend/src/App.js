import React, { useState } from 'react';
import Header from './components/header';
import MemesContainer from './components/memesContainer';
import './globalStyles.css';
export default function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className='App'>
      <Header setShowModal={setShowModal} />
      <MemesContainer showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}
