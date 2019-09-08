import React, {Component} from 'react';

import './Home.css';
import{API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE} from '../../configure';

import FrontPageImage from '../elements/FrontPageImage/FrontPageImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreButton from '../elements/LoadMoreButton/LoadMoreButton';
import Spinner from '../elements/Spinner/Spinner';

import NOImage from '../../assets/images/no_image.jpg';

class Home extends Component {
  state = {
    movies: [],
    frontImg: null,
    loading: false,
    currentPage: 0,
    totalPage: 0,
    searchTerm: ''
  }

  componentDidMount() {
    if(sessionStorage.getItem('HomeState')){
      const state = JSON.parse(sessionStorage.getItem('HomeState'));
      this.setState({...state});
    }else{
      this.setState({ loading: true })
      const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
      this.fetchItems(endpoint);
    }
  }
 /*
  fetchItems = (endpoint) => {
    const { movies, frontImg, searchTerm } = this.state;
    fetch(endpoint)
    .then(res => res.json())
    .then(res => {
      // console.log(res);
      this.setState({
        movies: [...movies, ...res.results],
        frontImg: frontImg || res.results[0],
        loading: false,
        currentPage: res.page,
        totalPages: res.total_pages
      })
    })
  }
*/

  

//async and await
  fetchItems = async endpoint => {
    const { movies, frontImg, searchTerm } = this.state;
    const res = await (await fetch(endpoint)).json();
    try{
      this.setState({
        movies: [...movies, ...res.results],
        frontImg: frontImg || res.results[0],
        loading: false,
        currentPage: res.page,
        totalPages: res.total_pages
      }, () => {
        // Remember the state for the next mount if not in a search view
        if (searchTerm === "") {
          sessionStorage.setItem('HomeState', JSON.stringify(this.state));
        }
      })
    }catch(error) {
      console.log("Error: ", error);
    }
  }



  // Loading more movies
  loadMoreItems = () => {
    const { searchTerm, currentPage } = this.state;

    let endpoint = '';
    this.setState({ loading: true })

    if (searchTerm === '') {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage + 1}`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=${currentPage + 1}`;
    }
    this.fetchItems(endpoint);
  }

  //search
  searchItems = (searchTerm) => {
    console.log(searchTerm);
    let endpoint = '';
    this.setState({
      movies: [],
      loading: true,
      searchTerm: searchTerm
    });

    if(searchTerm === ''){
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    }else{
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}$`;
    }

    this.fetchItems(endpoint);
  };


  render() {
    return (
      <div className="rmdb-home">
        {this.state.frontImg ?
          <div>
            <FrontPageImage 
              image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.frontImg.backdrop_path}`}
              title={this.state.frontImg.original_title}
              text={this.state.frontImg.overview}
            />
          </div> : null
        };
        <SearchBar callback={this.searchItems} />
        <div className="rmdb-home-grid">
          <FourColGrid
            header = {this.state.searchTerm ? 'Search Result' : 'Popular Movies'}
            loading = {this.state.loading} >
            {this.state.movies.map((ele, i) => {
              return <MovieThumb
                      key={i} 
                      clickable={true}
                      image={ele.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${ele.poster_path}` : {NOImage}}
                      movieId={ele.id}
                      movieName={ele.original_title}
                      />
              })
            }
          </FourColGrid>
          {this.state.loading ? <Spinner /> : null}
          {(this.state.currentPage < this.state.totalPages && !this.state.loading) ?
              <LoadMoreButton text="Load More" onClick={this.loadMoreItems} />
              : null
          }
        </div>
      </div>
    );
  }
}

export default Home;