import axios from 'axios';
import React, { useState } from 'react';
import EditMeme from '../editMeme';
import './styles.css';
export default function MemeItem({ currentMeme, deleteHandler, handler }) {
  const { name, url, caption } = currentMeme;
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className='meme'>
      <h3 className='meme-name'>{name}</h3>
      <div className='img-box'>
        <img src={url} alt='Image Not Available' className='meme-img' />
      </div>
      <p className='meme-caption'>{caption}</p>
      <button
        className='delete-meme'
        onClick={() => deleteHandler(currentMeme.id)}
      >
        DELETE
      </button>
      <button
        className='update-meme'
        onClick={() => {
          setShowEditModal((prev) => !prev);
          document.body.className += 'no-scroll';
        }}
      >
        EDIT
      </button>
      <EditMeme
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        currentMeme={currentMeme}
        handler={handler}
      />
    </div>
  );
}
