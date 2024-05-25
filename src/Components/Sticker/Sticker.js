import React from 'react';
import axios from 'axios'; 
import './Sticker.css';

const Sticker = ({ data, category, obtained, special, onObtain }) => {
  const handleObtain = () => {
    onObtain(category, { id: data.url, title: data.title || data.name || data.model });
  };

  const handleShowDetails = async () => {
    if (obtained) {
      try {
        const response = await axios.get(data.url);
        alert(JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.error('Error fetching sticker details:', error);
      }
    }
  };

  return (
    <div className={`sticker ${obtained ? 'obtained' : ''} ${special ? 'special' : 'regular'}`} onClick={handleShowDetails}>
      <h3>{data.title || data.name || data.model}</h3>
      <p>ID: {data.url.match(/\d+/)[0]}</p>
      <p>Categoría: {special ? 'Especial' : 'Regular'}</p>
      <p>Sección: {category.charAt(0).toUpperCase() + category.slice(1)}</p>
      {obtained ? (
        <p>En el álbum</p>
      ) : (
        <p>No tienes el sticker</p>
      )}
    </div>
  );
};

export default Sticker;