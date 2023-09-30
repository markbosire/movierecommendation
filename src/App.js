import { MovieFilter } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import "./App.css";

const App = () => {
  const genres=
     [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 16,
        "name": "Animation"
      },
      {
        "id": 35,
        "name": "Comedy"
      },
      {
        "id": 80,
        "name": "Crime"
      },
      {
        "id": 99,
        "name": "Documentary"
      },
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 10751,
        "name": "Family"
      },
      {
        "id": 14,
        "name": "Fantasy"
      },
      {
        "id": 36,
        "name": "History"
      },
      {
        "id": 27,
        "name": "Horror"
      },
      {
        "id": 10402,
        "name": "Music"
      },
      {
        "id": 9648,
        "name": "Mystery"
      },
      {
        "id": 10749,
        "name": "Romance"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      },
      {
        "id": 10770,
        "name": "TV Movie"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 10752,
        "name": "War"
      },
      {
        "id": 37,
        "name": "Western"
      }
    ]
    const getGenreName = (genreId) => {
      const genre = genres.find((genre) => genre.id === genreId);
      return genre ? genre.name : 'Unknown Genre';
    };
  
  const [movies, setMovies] = useState([]);
  const [movieIndex, setMovieIndex] = useState(0);
  const [era, setEra] = useState('70s');
  const [month, setMonth] = useState('01');
  const [day, setDay] = useState('01');
  const [selectedRatingRange, setSelectedRatingRange] = useState('all'); // Initialize with 'all'
  const [backgroundImage, setBackgroundImage] = useState('');
  const [movieLoading,setMovieLoading]=useState(true)
  useEffect(() => {
    // Set the background image when movieIndex changes
    if (movies.length > 0) {
      setBackgroundImage(`https://image.tmdb.org/t/p/original${movies[movieIndex].backdrop_path}`);
    }
  }, [movieIndex, movies]);
  const handleSearchTrailer = () => {
    // Construct the YouTube search query
    const movieTitle = movies[movieIndex].title;
    const movieYear = movies[movieIndex].release_date.substring(0, 4); // Extract the year from the release date
    const searchQuery = `${movieTitle} ${movieYear} trailer`;
  
    // Create the YouTube search URL
    const youtubeURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
  
    // Open a new tab or window with the YouTube search results
    window.open(youtubeURL, '_blank');
  };
  


  useEffect(() => {
    setMovieLoading(true)
    fetchMovies();
  }, [era, month, day,selectedRatingRange]);
  const getRatingFilter = (selectedRatingRange) => {
  switch (selectedRatingRange) {
    case 'below5':
      return 'vote_average.lte=5';
    case 'above5':
      return 'vote_average.gte=5';
    case 'above7':
      return 'vote_average.gte=7';
    case '10':
      return 'vote_average.gte=10';
    default:
      return ''; // If 'all' or an invalid option is selected, don't include a rating filter
  }
};


  const fetchMovies = async () => {
    let eraStart, eraEnd;
    switch (era) {
      case '70s':
        eraStart = '1970-01-01';
        eraEnd = '1979-12-31';
        break;
      case '80s':
        eraStart = '1980-01-01';
        eraEnd = '1989-12-31';
        break;
      case '90s':
        eraStart = '1990-01-01';
        eraEnd = '1999-12-31';
        break;
      case '00s':
        eraStart = '2000-01-01';
        eraEnd = '2009-12-31';
        break;
      case '10s':
        eraStart = '2010-01-01';
        eraEnd = '2019-12-31';
        break;
      case '20s':
        eraStart = '2020-01-01';
        eraEnd = new Date().toISOString().split('T')[0]; // Set eraEnd to the current date
        break;
      default:
        // Handle default case or show an error
    }
  
    let collectedMovies = [];
  
    while (collectedMovies.length < 3) {
      try {
        let page = Math.floor(Math.random() * 100) + 1;
  
       const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=7bbc16b08ec7ccb42b7d7b4c5b289bdf&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&primary_release_date.gte=${eraStart}&primary_release_date.lte=${eraEnd}&${getRatingFilter(selectedRatingRange)}&with_genres=27`);

        if (!response.ok) {
          // Handle API error here, you can log an error message or throw an exception
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        let filteredMovies = data.results.filter(movie => {
          let releaseDate = new Date(movie.release_date);
          return releaseDate.getMonth() + 1 === parseInt(month) && releaseDate.getDate() === parseInt(day) && movie.backdrop_path && movie.poster_path;
        });
  
        collectedMovies = collectedMovies.concat(filteredMovies);
  
        if (collectedMovies.length < 3) {
          // If we still have fewer than 3 movies, continue the loop
          continue;
        }
  
        // If we have collected 3 or more movies, stop the loop and set the state
      // Inside fetchMovies
// After setting the movies state, set the background image
setMovies(collectedMovies.slice(0, 3));
setBackgroundImage(`https://image.tmdb.org/t/p/original${collectedMovies[movieIndex].backdrop_path}`);
setMovieLoading(false)

        console.log(movies)
      } catch (error) {
        // Handle any errors that occur during the fetch process
        console.error(error);
  
       
       
           continue;
        // Retry after 1 second (adjust as needed)
      }
    }
  };
  
  function getDaysInMonth(month) {
    const month31 = ['01', '03', '05', '07', '08', '10', '12'];
    const month30 = ['04', '06', '09', '11'];
    const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const currentYear = new Date().getFullYear();
  
    if (month === '02') {
      return isLeapYear(currentYear) ? 29 : 28;
    } else if (month31.includes(month)) {
      return 31;
    } else if (month30.includes(month)) {
      return 30;
    } else {
      return 31; // Default to 31 days if the month is not recognized.
    }
  }
 
  return (
    <div className={`background-image ${movies.length > 0 ? '' : 'st'}`} style={{ backgroundImage: ` linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})` }}>
    
    {movies.length>0?
      <div className='fullHeight'>
        <div className='selectors'>
      <div className="dropdown-container">
        <label htmlFor="era">Era</label>
        <select id="era" value={era} onChange={(e) => setEra(e.target.value)}>
          <option value="70s">70s</option>
          <option value="80s">80s</option>
          <option value="90s">90s</option>
          <option value="00s">00s</option>
          <option value="10s">10s</option>
          <option value="20s">20s</option>
        </select>
      </div>
      <div className="dropdown-container">
  <label htmlFor="month">Month</label>
  <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
    <option value="01">January</option>
    <option value="02">February</option>
    <option value="03">March</option>
    <option value="04">April</option>
    <option value="05">May</option>
    <option value="06">June</option>
    <option value="07">July</option>
    <option value="08">August</option>
    <option value="09">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
  </select>
</div>

<div className="dropdown-container">
  <label htmlFor="day">Day</label>
  <select id="day" value={day} onChange={(e) => setDay(e.target.value)}>
    {Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1).map((dayOption) => (
      <option key={dayOption} value={dayOption}>
        {dayOption}
      </option>
    ))}
  </select>
</div>
<div className="dropdown-container">
  <label htmlFor="rating">Rating</label>
  <select id="rating" value={selectedRatingRange} onChange={(e) => setSelectedRatingRange(e.target.value)}>
    <option value="all">All</option>
    <option value="below5">Below 5</option>
    <option value="above5">Above 5</option>
    <option value="above7">Above 7</option>
    <option value="10">10</option>
  </select>
</div>
</div>

<div className='movieSelector'>
  <div className={movieIndex===0?"active":""} onClick={() => setMovieIndex(0)}><p>1</p></div>
  <div className={movieIndex===1?"active":""} onClick={() => setMovieIndex(1)}><p>2</p></div>
  <div className={movieIndex===2?"active":""} onClick={() => setMovieIndex(2)}><p>3 </p></div>
</div>


     
{movieLoading?<div className='loading'><div class="loadingio-spinner-dual-ball-8b5q70g0vmv"><div class="ldio-67vo9x8f3d">
<div></div><div></div><div></div>
</div></div></div>:<div className='movie-container'>
  <section>
          <div className='movie-poster'>
            <img src={`https://image.tmdb.org/t/p/w500${movies[movieIndex].poster_path}`} alt={movies[movieIndex].title} />
          </div>
          <div className='movie-details'>
            <div>
              <p className='movie-title'>{movies[movieIndex].title}</p>
              <p className='movie-description'>{movies[movieIndex].overview}</p>
              <div className='tag-container'>
                {movies[movieIndex].genre_ids.map((genreId) => (
                  <div key={genreId} className='tag'>
                    {getGenreName(genreId)}
                  </div>
                ))}
              </div>
            </div>
            <div className='movie-info'>
              <p className='movie-year'><strong>Release date: </strong>{movies[movieIndex].release_date}</p>
              <p className='movie-rating'><strong>Movie Rating: </strong>{movies[movieIndex].vote_average}/10</p>
              <p><strong>Vote Count: </strong>{movies[movieIndex].vote_count} votes</p>
            </div>
            <div className='movie-trailer' onClick={handleSearchTrailer}>Search Trailer</div>

          </div>
          
          </section>
        </div>}
      
    </div>:<div class="loadingio-spinner-dual-ball-8b5q70g0vmv"><div class="ldio-67vo9x8f3d">
<div></div><div></div><div></div>
</div></div>

}</div>
  );
};

export default App;
