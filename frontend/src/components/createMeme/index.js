import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';
export default function CreateMeme({ showModal, setShowModal, handler }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('./initialImg.jpg');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url == './invalidImg.jpg') setError('Invalid Link !');
    else {
      const meme = {
        name: name,
        url: url,
        caption: caption,
      };
      axios
        .post('http://localhost:8081/memes', meme)
        .then((res) => {
          handler();
          setUrl('./initialImg.jpg');
          setShowModal(false);
          document.body.className = '';
        })
        .catch((err) => {
          if (err.response.status == 409)
            setError('Duplicate Meme ! Please try with different details');
          else if ((err.response.status = 422))
            setError('Please fill all the fields !');
        });
    }
  };

  return (
    <>
      {showModal ? (
        <div className='background'>
          <div className='createModal-container'>
            <div className='preview-container'>
              <img
                src={url}
                alt=''
                className='preview-image'
                onError={(e) => {
                  setUrl('./invalidImg.jpg');
                }}
              />
            </div>
            <form className='create-form' onSubmit={handleSubmit}>
              <div className='err-msg'>{error}</div>
              <label htmlFor='name'>NAME</label>
              <input
                type='text'
                placeholder='Enter Name'
                className='name'
                required
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor='url'>Link</label>
              <input
                type='text'
                placeholder='Enter Link'
                className='url'
                required
                onChange={(e) => {
                  if (e.target.value.length > 0) setUrl(e.target.value);
                  else setUrl('./initialImg.jpg');
                  if (e.target.value.length > 10 && url == './invalidImg.jpg')
                    setError('Invalid Link');
                  else setError('');
                }}
              />

              <label htmlFor='caption'>Caption</label>
              <input
                type='text'
                placeholder='Enter Caption'
                className='caption'
                required
                onChange={(e) => setCaption(e.target.value)}
              />
              <button className='submit'>SUBMIT</button>
            </form>
            <img
              src='x.png'
              alt=''
              className='close-modal'
              onClick={() => {
                setShowModal(false);
                document.body.className = '';
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
