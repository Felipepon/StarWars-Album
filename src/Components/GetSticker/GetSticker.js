import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAlbum } from '../../Context/AlbumContext';
import { useTimer } from '../../Context/TimerContext';
import './GetStickers.css';

function GetStickers() {
  const { agregarAlAlbum, descartarLamina, estaEnElAlbum } = useAlbum();
  const { timers, resetTimer } = useTimer();
  const [sobres, setSobres] = useState([true, false, false, false]);
  const [laminas, setLaminas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allStickers, setAllStickers] = useState({
    films: [],
    people: [],
    starships: []
  });

  useEffect(() => {
    const fetchAllStickers = async () => {
      try {
        const filmsResponse = await axios.get('https://swapi.dev/api/films/');
        const films = filmsResponse.data.results.map((film) => ({
          ...film,
          id: film.url.match(/\d+/)[0],
          special: parseInt(film.url.match(/\d+/)[0], 10) <= 6,
          section: 'Películas'
        }));

        let allPeople = [];
        let nextPeopleUrl = 'https://swapi.dev/api/people/';

        while (nextPeopleUrl) {
          const response = await axios.get(nextPeopleUrl);
          const people = response.data.results.map((person) => ({
            ...person,
            id: person.url.match(/\d+/)[0],
            special: parseInt(person.url.match(/\d+/)[0], 10) <= 20,
            section: 'Personajes'
          }));
          allPeople = [...allPeople, ...people];
          nextPeopleUrl = response.data.next;
        }

        let allStarships = [];
        let nextStarshipsUrl = 'https://swapi.dev/api/starships/';

        while (nextStarshipsUrl) {
          const response = await axios.get(nextStarshipsUrl);
          const starships = response.data.results.map((starship) => ({
            ...starship,
            id: starship.url.match(/\d+/)[0],
            special: parseInt(starship.url.match(/\d+/)[0], 10) <= 10,
            section: 'Naves'
          }));
          allStarships = [...allStarships, ...starships];
          nextStarshipsUrl = response.data.next;
        }

        setAllStickers({ films, people: allPeople, starships: allStarships });
      } catch (error) {
        console.error('Error fetching stickers data:', error);
      }
    };

    fetchAllStickers();
  }, []);

  const abrirSobre = (index) => {
    setLoading(true);
    setSobres(sobres.map(() => false));
    resetTimer(`sobre${index}`, 60);

    const config = Math.random() > 0.5 ? 'config1' : 'config2';
    const endpoints = config === 'config1'
      ? ['films', 'people', 'people', 'people', 'starships']
      : ['people', 'people', 'people', 'starships', 'starships'];

    try {
      const nuevasLaminas = endpoints.map((endpoint) => {
        const stickersList = allStickers[endpoint];
        if (!stickersList || stickersList.length === 0) {
          throw new Error('No hay datos disponibles para generar láminas.');
        }
        return stickersList[Math.floor(Math.random() * stickersList.length)];
      });

      setLaminas(nuevasLaminas);
    } catch (error) {
      console.error('Error al generar nuevas láminas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (lamina, action) => {
    if (action === 'agregar') {
      agregarAlAlbum(lamina);
    } else {
      descartarLamina(lamina.id);
    }
    setLaminas(prevLaminas => {
      const newLaminas = prevLaminas.filter(l => l.id !== lamina.id);
      if (newLaminas.length === 0) {
        setSobres([true, false, false, false]); 
      }
      return newLaminas;
    });
  };

  return (
    <div>
      <h1 className='titulo' >Obtener Láminas</h1>
      <div className="sobres">
        {sobres.map((sob, index) => (
          <button
            key={index}
            onClick={() => abrirSobre(index)}
            disabled={loading || timers[`sobre${index}`] > 0}
          >
            {timers[`sobre${index}`] > 0 
              ? `Disponible en ${timers[`sobre${index}`]}s`
              : "Abrir Sobre"
            }
          </button>
        ))}
      </div>
      <div className="laminas">
        {laminas.map((lamina, index) => {
          if (!lamina || !lamina.id) {
            return null;
          }
          const enElAlbum = estaEnElAlbum(lamina.id);
          return (
            <div key={index} className={`lamina ${enElAlbum ? 'en-album' : 'fuera-album'}`}>
              <h3>{lamina.title || lamina.name}</h3>
              <p>ID: {lamina.id}</p>
              <p>Categoría: {lamina.special ? 'Especial' : 'Regular'}</p>
              <p>Sección: {lamina.section}</p>
              {enElAlbum ? (
                <button onClick={() => handleAction(lamina, 'descartar')}>Descartar</button>
              ) : (
                <button onClick={() => handleAction(lamina, 'agregar')}>Agregar al álbum</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GetStickers;
