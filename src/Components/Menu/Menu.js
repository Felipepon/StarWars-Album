import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.css'; 

const Menu = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/get-stickers"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Obtener Láminas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/my-album"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Mi álbum
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
