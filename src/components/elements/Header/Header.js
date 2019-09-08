import React from 'react';
import {Link} from 'react-router-dom';

import './Header.css';
import Logo from '../../../assets/images/logo.png';
import tmdbLogo from '../../../assets/images/tmdb_logo.png';

const Header = () => {
  return (
    <div className="rmdb-header">
      <div className="rmdb-header-content">
        <Link to="/" >
          <img className="rmdb-logo" src={Logo} alt="logo"/>
        </Link>
        <img className="rmdb-tmdb-logo" src={tmdbLogo} alt="tmdb-logo"/>
      </div>
    </div>
  );
};

export default Header;