import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sticker from '../Sticker/Sticker';
import { useAlbum } from '../../Context/AlbumContext';
import './Album.css';

const Album = () => {
  const { agregarAlAlbum, estaEnElAlbum } = useAlbum();
  const [stickers, setStickers] = useState({
    movies: [],
    characters: [],
    starships: []
  });

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        
        const moviesResponse = await axios.get('https://swapi.dev/api/films/');
        const movies = moviesResponse.data.results.map(movie => ({
          ...movie,
          special: true, 
          obtained: estaEnElAlbum(movie.url.match(/\d+/)[0]) 
        }));

        setStickers(prevState => ({
          ...prevState,
          movies
        }));
      } catch (error) {
        console.error('Error fetching album data:', error);
      }
    };

    const fetchCharacters = async () => {
      try {
        let allCharacters = [];
        let nextUrl = 'https://swapi.dev/api/people/';

        while (nextUrl) {
          const response = await axios.get(nextUrl);
          const characters = response.data.results.map(character => ({
            ...character,
            special: allCharacters.length < 20, 
            obtained: estaEnElAlbum(character.url.match(/\d+/)[0])
          }));
          allCharacters = [...allCharacters, ...characters];
          nextUrl = response.data.next;
        }

        setStickers(prevState => ({
          ...prevState,
          characters: allCharacters
        }));
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    const fetchAllStarships = async () => {
      try {
        let allStarships = [];
        let nextUrl = 'https://swapi.dev/api/starships/';

        while (nextUrl) {
          const response = await axios.get(nextUrl);
          const starships = response.data.results.map((starship, index) => ({
            ...starship,
            special: allStarships.length < 10, 
            obtained: estaEnElAlbum(starship.url.match(/\d+/)[0])
          }));
          allStarships = [...allStarships, ...starships];
          nextUrl = response.data.next;
        }

        setStickers(prevState => ({
          ...prevState,
          starships: allStarships
        }));
      } catch (error) {
        console.error('Error fetching starships:', error);
      }
    };

    fetchAlbum();
    fetchCharacters();
    fetchAllStarships();
  }, [estaEnElAlbum]);

  const obtainSticker = (category, sticker) => {
    agregarAlAlbum(sticker);
  };

  const isObtained = (category, id) => {
    const laminas = stickers[category];
    const sticker = laminas.find(sticker => sticker.url.match(/\d+/)[0] === id);
    return sticker && sticker.obtained;
  };

  return (
    <div className="album">
      <h1>Mi álbum</h1>
      {['movies', 'characters', 'starships'].map(category => (
        <div className="section" key={category}>
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          <div className="stickers">
            {stickers[category].map(sticker => (
              <Sticker
                key={sticker.url}
                data={sticker}
                category={category}
                obtained={sticker.obtained}
                special={sticker.special}
                onObtain={obtainSticker}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Album;