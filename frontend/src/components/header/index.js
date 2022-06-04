import React from 'react';
import './styles.css';
export default function Header({ setShowModal }) {
  return (
    <div className='header-container'>
      <div className='title'>
        <div className='title-text'>
          <span>XMEME</span> Destination to your Daily meme appetite
        </div>
      </div>
      <div className='header-buttons'>
        <button
          className='create'
          onClick={() => {
            setShowModal((prev) => !prev);
            document.body.className += 'no-scroll';
          }}
        >
          ADD MEME
        </button>
        <a className='swagger' href='http://localhost:8081/swagger-ui'>
          SWAGGER
        </a>
      </div>
    </div>
  );
}
