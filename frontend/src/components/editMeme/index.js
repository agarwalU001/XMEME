import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';
export default function EditMeme({
  showEditModal,
  setShowEditModal,
  currentMeme,
  handler,
}) {
  const [updatedUrl, setUpdatedUrl] = useState(currentMeme.url);
  const [updatedCaption, setUpdatedCaption] = useState(currentMeme.caption);

  const updateHandler = (id) => {
    const data = {
      url: updatedUrl,
      caption: updatedCaption,
    };
    axios
      .patch(`http://localhost:8081/memes/${id}`, data)
      .then(() => handler())
      .catch((err) => console.log(err));
  };

  return (
    <>
      {showEditModal ? (
        <div className='edit-background'>
          <div className='edit-modal'>
            <div className='edit-image-preview'>
              <img
                src={updatedUrl}
                alt=''
                className='edit-img'
                onError={() => setUpdatedUrl(currentMeme.url)}
              />
            </div>
            <form action='' className='edit-form'>
              <label htmlFor='name'>NAME</label>
              <input type='text' disabled={true} value={currentMeme.name} />
              <label htmlFor='Updatedurl'>Link</label>
              <input
                type='text'
                placeholder='Enter new Link'
                className='updated-url'
                onChange={(e) => {
                  setUpdatedUrl(e.target.value);
                }}
              />

              <label htmlFor='caption'>Caption</label>
              <input
                type='text'
                placeholder='Enter New Caption'
                className='updated-caption'
                onChange={(e) => setUpdatedCaption(e.target.value)}
              />
              <button
                className='submit-updated-meme'
                type='submit'
                onClick={(e) => {
                  e.preventDefault();
                  updateHandler(currentMeme.id);
                  setShowEditModal((prev) => !prev);
                  document.body.className = '';
                }}
              >
                SUBMIT
              </button>
            </form>
            <img
              src='x.png'
              alt=''
              className='close-modal'
              onClick={() => {
                setShowEditModal(false);
                document.body.className = '';
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
