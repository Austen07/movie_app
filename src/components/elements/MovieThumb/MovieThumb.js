import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import "./MovieThumb.css";

const MovieThumb = (props) => {
  return (
    <div className="rmdb-moviethumb">
      {props.clickable ? 
        <Link to={{pathname: `/${props.movieId}`, movieName: `${props.movieName}`}} >
          <img src={props.image} alt="movie thumb" />
        </Link>
        : 
        <img src={props.image} alt="movie thumb" />
      }  
    </div>
  );
};

MovieThumb.propTypes = {
  image: PropTypes.string,
  movieId: PropTypes.number,
  movie: PropTypes.string
}

export default MovieThumb;