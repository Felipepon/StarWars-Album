import React, { createContext, useContext, useState } from 'react';

const AlbumContext = createContext();

export const AlbumProvider = ({ children }) => {
  const [album, setAlbum] = useState([]);
  
  const agregarAlAlbum = (lamina) => {
    setAlbum(prevAlbum => [...prevAlbum, lamina]);
  };

  const descartarLamina = (id) => {
    setAlbum(prevAlbum => prevAlbum.filter(lamina => lamina.url.match(/\d+/)[0] !== id));
  };

  const estaEnElAlbum = (id) => {
    return album.some(lamina => lamina.url.match(/\d+/)[0] === id);
  };

  return (
    <AlbumContext.Provider value={{ album, agregarAlAlbum, descartarLamina, estaEnElAlbum }}>
      {children}
    </AlbumContext.Provider>
  );
};

export const useAlbum = () => useContext(AlbumContext);
