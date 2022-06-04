import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MemeItem from '../memeItem';
import './styles.css';
import CreateMeme from '../createMeme';
export default function MemesContainer({ showModal, setShowModal }) {
  const [memes, setMemes] = useState([]);

  const handler = () => {
    axios
      .get('http://localhost:8081/memes')
      .then((res) => setMemes(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    handler();
  }, []);

  const deleteHandler = (id) => {
    axios
      .delete(`http://localhost:8081/memes/${id}`)
      .then(() => handler())
      .catch((err) => console.log(err));
  };

  // const memeList = () =>{
  //    return  (
  //     {memes.map((currentMeme) => {
  //       memes.length > 0 ? (
  //           <MemeItem
  //             key={currentMeme.id}
  //             currentMeme={currentMeme}
  //             deleteHandler={deleteHandler}
  //             handler={handler}
  //           />
  //         ) : (
  //           <p>No Posts Yet , Be the first !</p>
  //         )}}

  const memeList = () => {
    return (
      <>
        {memes.length ? (
          memes.map((currentMeme) => {
            return (
              <MemeItem
                key={currentMeme.id}
                currentMeme={currentMeme}
                deleteHandler={deleteHandler}
                handler={handler}
              />
            );
          })
        ) : (
          <h1 className='no-posts'>No Posts yet, Be the first !</h1>
        )}
      </>
    );
  };

  return (
    <>
      <div className='memes-container'>
        <CreateMeme
          showModal={showModal}
          setShowModal={setShowModal}
          handler={handler}
        />
        {memeList()}
      </div>
    </>
  );
}
