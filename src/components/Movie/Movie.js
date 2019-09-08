import React, {Component} from 'react';
import{API_URL, API_KEY} from '../../configure';

import Navigation from '../elements/Navigation/Navigation';
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar';
import MovieInfo from '../elements/MovieInfo/MovieInfo';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import Actor from '../elements/Actor/Actor';
import Spinner from '../elements/Spinner/Spinner';

import './Movie.css';


class Movie extends Component {
  state = {
    movie: null,
    actors: null,
    directors: [],
    loading: false
  }

  componentDidMount() {
    const { movieId } = this.props.match.params;
    if(sessionStorage.getItem(`${movieId}`)) {
      const state = JSON.parse(localStorage.getItem(`${movieId}`))
      this.setState({ ...state })
    }else{
      this.setState({
        loading: true
      });

      const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-US`;
      this.fetchItems(endpoint);
    }
  }

  fetchItems = async endpoint => {
    const {movieId} = this.props.match.params;
    try {
      //res is the fetched movie information
      const res = await(await fetch(endpoint)).json();
      if(res.status_code){
        this.setState({loading: false});
      }else{
        this.setState({movie: res});
        const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
        const creditsResult = await(await fetch(creditsEndpoint)).json();
        const directors = creditsResult.crew.filter((member) => member.job === 'Director');
        
        this.setState({
          actors: creditsResult.cast,
          directors: directors,
          loading: false
        }, () => {
          sessionStorage.setItem(`${movieId}`, JSON.stringify(this.state));
        });
      }
    }catch(error){
      console.log("Error: " , error);
    }
  }

/*
  fetchItems = (endpoint) => {
    const { movieId } = this.props.match.params;
    fetch(endpoint)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if(res.status_code){
        this.setState({loading: false});
      }else{
        this.setState({movie: res}, () => {
          const endpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
          fetch(endpoint)
          .then(res => res.json())
          .then(res => {
            const directors = res.crew.filter((member) => member.job === 'Director');

            this.setState({
              actors: res.cast,
              directors: directors,
              loading: false
            }, () => {
              localStorage.setItem(`${movieId}`, JSON.stringify(this.state));
            });
          });
        });
      }
    })
    .catch(error => console.log('Error:', error));
  };
*/


  render () {
    return (
      <div className="rmdb-movie">
        {this.state.movie ?
          <div>
            <Navigation movie={this.props.location.movieName} />
            <MovieInfo movie={this.state.movie} directors={this.state.directors}/>
            <MovieInfoBar 
              time={this.state.movie.runtime} 
              budget={this.state.movie.budget}
              revenue={this.state.movie.revenue}
            />
          </div> 
          : null
        }
        {this.state.actors ?
          <div className="rmdb-movie-grid">
            <FourColGrid header={'Cast'} loading={false}>
              {this.state.actors.map((ele, i) => {
                return <Actor key={i} actor={ele} />
              })}
            </FourColGrid>
          </div>
          : null
        } 
        {!this.state.actors  && !this.state.loading ? <h1>No movie found</h1> : null}    
        {!this.state.loading ? <Spinner />: null} 
      </div>
    )
  }
}

export default Movie;