// this is the api key
const APIKEY = 'api_key=af5fdbd002b736194b819279d9cd1c82';
// this is the home url 
const HOMEURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
// this is the image url 
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

// fetching elements from indexedDB.html 
var container = document.getElementById('movie-container');
var search = document.getElementById('searchMovie');
var wrapperDiv = document.querySelector('.search-content');
var resultsDiv = document.querySelector('.results');

function createMovieElement(movie) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    movieElement.innerHTML = `
        <div class="movie-poster">
            <img src="${IMAGEURL + movie.poster_path}" alt="Movie Poster">
            <div class="movie-title-overlay">
                <div class="movie-title">${movie.title}</div>
            </div>
        </div>
        <div class="movie-element-tags">
            <div class="movie-rating">
                <i class="fas fa-star"></i> ${movie.vote_average} 
            </div>
            <button class="view-trailer" data-movie-id="${movie.id}">View Trailer</button>
        </div>
    `;
    return movieElement;
}

// Function to fetch and display recent movies
async function displayRecentMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=2023-01-01`);
        const data = await response.json();
        const recentMovies = data.results.slice(10, 20);

        const carouselContainer = $('#carousel-container');

        recentMovies.forEach(movie => {
            const slide = `
                <div class="carousel-slide">
                    <div class="carousel-poster">
                        <img src="${IMAGEURL + movie.poster_path}" alt="Movie Poster">
                    </div>
                    <div class="carousel-info">
                        <div class="movie-title-1">${movie.title}</div>
                        <button class="view-trailer" onclick="showTrailer(${movie.id})">View Trailer</button>
                    </div>
                </div>
            `;
            carouselContainer.append(slide);
        });

        // Initialize Slick carousel after adding slides
        $('.filtering').slick({
            slidesToShow: 5,
            slidesToScroll: 5,
            autoplay: true,
            autoplaySpeed: 2000,
        });
    } catch (error) {
        console.error('Error fetching recent movies:', error);
    }
}

// Function to fetch movie details and redirect to trailer
async function showTrailer(movieId) {
    try {
        const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?${APIKEY}&append_to_response=videos`);
        const movieData = await movieResponse.json();
        const videos = movieData.videos.results;
        const trailerKey = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube')?.key;
        if (trailerKey) {
            window.location.href = `https://www.youtube.com/watch?v=${trailerKey}`;
        } else {
            console.log('Trailer not available');
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Call the function to display recent movies
displayRecentMovies();
// this is the previous button

// Function to fetch and display featured movies
async function displayFeaturedMovies() {
    try {
        const featuredResponse = await fetch(`https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=1`);
        const featuredData = await featuredResponse.json();
        const featuredMovies = getRandomMovies(featuredData.results, 3); // Get 3 random movies from the fetched data

        const featuredContainer = document.querySelector('.featured-movies');

        featuredMovies.forEach(movie => {
            const featuredMovieElement = createFeaturedMovieElement(movie);
            featuredContainer.appendChild(featuredMovieElement);
        });
    } catch (error) {
        console.error('Error fetching featured movies:', error);
    }
}

// Function to create the HTML structure for a featured movie
function createFeaturedMovieElement(movie) {
    const featuredMovieElement = document.createElement('div');
    featuredMovieElement.classList.add('featured-movie');

    const posterImage = document.createElement('img');
    posterImage.src = `${IMAGEURL + movie.poster_path}`;
    posterImage.alt = 'Movie Poster';
    // Adjust the width and height of the image directly
    posterImage.style.width = '200px'; // Example width
    posterImage.style.height = 'auto'; // Adjust height proportionally

    posterImage.addEventListener('click', () => {
        window.location.href = `moviePage.html?id=${movie.id}`; // Redirects to moviePage.html with the movie ID
    });

    const movieTitle = document.createElement('div');
    movieTitle.classList.add('featured-movie-title');
    movieTitle.textContent = movie.title;

    featuredMovieElement.appendChild(posterImage);
    featuredMovieElement.appendChild(movieTitle);

    return featuredMovieElement;
}


// Function to get a specified number of random movies from an array of movies
function getRandomMovies(moviesArray, count) {
    const shuffled = moviesArray.sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Get selected number of items
}

// Call the function to display featured movies
displayFeaturedMovies();

var pBtn = document.getElementById('prev-page');
// this is the next button
var nBtn = document.getElementById('next-page');
// count of pages 
let pageNumber = 1;

// calling function to request api 
apiCall(HOMEURL);
// this is the function to get api data 
function apiCall(url){
    const x = new XMLHttpRequest();
    x.open('get',url);
    x.send();
    x.onload = function(){
        container.innerHTML="";
        var res = x.response;
        // resp to JSON data 
        var conJson = JSON.parse(res);
        // array of movies 
        var moviesArray = conJson.results;
        // create the movie cards here 
        moviesArray.forEach(movie => moviesElement(movie));
        addMovieToListButtonArray = document.getElementsByClassName('.add-movie-to-list');
    }
}

// create the home page elements 
function moviesElement(movie){
    var movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    movieElement.innerHTML = `
        <div class="movie-poster">
            <a href="moviePage.html?id=${movie.id}"><img src= ${IMAGEURL+movie.poster_path} alt="Movie Poster"></a>
        </div>
        <div class="movie-title">${movie.title}</div>
        <div class="movie-element-tags">
            <div class="movie-rating">
            <i class="fas fa-star"></i> ${movie.vote_average} 
            </div>
            <div class="add-movie-to-list"  id="${movie.id}" onclick="addMovie(${movie.id})">
                <i class="fas fa-plus"></i>
            </div>
        </div>
    `;
    container.appendChild(movieElement);
}

async function displayComingSoonMovies() {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${currentDate}`);
        const data = await response.json();
        const comingSoonMovies = data.results.slice(0, 5);

        const movieList = document.querySelector('.coming-soon-movies .movie-list');

        // Create a flex container to align posters horizontally
        const posterFlexContainer = document.createElement('div');
        posterFlexContainer.classList.add('poster-flex-container');

        comingSoonMovies.forEach(movie => {
            const movieElement = createMovieElementWithDetails(movie);

            const poster = movieElement.querySelector('img');
            poster.style.width = '300px';
            poster.style.height = 'auto';

            // Append each movie element to the flex container
            posterFlexContainer.appendChild(movieElement);

            movieElement.addEventListener('click', () => {
                showMovieDetails(movie);
            });
        });

        // Append the flex container to the movie list
        movieList.appendChild(posterFlexContainer);

        // Start circular slideshow
        startCircularSlideshow(posterFlexContainer);

    } catch (error) {
        console.error('Error fetching coming soon movies:', error);
    }
}

// Function to start the circular slideshow
function startCircularSlideshow(container) {
    let currentPosition = 0;
    const posterWidth = container.children[0].clientWidth; // Width of each poster
    const posterCount = container.children.length;

    setInterval(() => {
        if (currentPosition < (posterCount - 1) * posterWidth) {
            currentPosition += posterWidth;
        } else {
            currentPosition = 0;
        }
        container.scrollTo({
            left: currentPosition,
            behavior: 'smooth'
        });
    }, 3000); // Change the interval duration (in milliseconds) as needed
}

// Call the function to display coming soon movies


function createMovieElementWithDetails(movie) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    const posterLink = document.createElement('a');
    posterLink.href = `movieDetails.html?id=${movie.id}`;
    const poster = document.createElement('img');
    poster.src = `${IMAGEURL + movie.poster_path}`;
    poster.alt = 'Movie Poster';
    posterLink.appendChild(poster);
    movieElement.appendChild(posterLink);

    const title = document.createElement('h3');
    title.textContent = movie.title;
    movieElement.appendChild(title);

    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Release Date: ${movie.release_date}`;
    movieElement.appendChild(releaseDate);

    return movieElement;
}


function createMovieElementWithDetails(movie) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    // Movie poster (linked to the movie details page)
    const posterLink = document.createElement('a');
    posterLink.href = `movieDetails.html?id=${movie.id}`; // Redirects to a separate movie details page with the movie ID
    const poster = document.createElement('img');
    poster.src = `${IMAGEURL + movie.poster_path}`;
    poster.alt = 'Movie Poster';
    posterLink.appendChild(poster);
    movieElement.appendChild(posterLink);

    // Movie title
    const title = document.createElement('h3');
    title.textContent = movie.title;
    movieElement.appendChild(title);

    // Release date
    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Release Date: ${movie.release_date}`;
    movieElement.appendChild(releaseDate);

    // Add more details as needed (genre, synopsis, etc.)

    return movieElement;
}

// Call the function to display coming soon movies
displayComingSoonMovies();

// Function to show more details about a selected movie
function showMovieDetails(movie) {
    // You can implement logic to display more information about the selected movie on a separate page/modal/dialog
    console.log('Selected Movie:', movie);
    // Example: Redirect to a separate movie details page or display information in a modal
}

// Call the function to display coming soon movies

// array to store fav movies 
var favMovies=[];
var oldMovies=[];

// function to add movie to fav list 
function addMovie(btnId){
    document.getElementById(btnId).innerHTML = '<i class="fas fa-check"></i>';
    // to avoid duplicate movies 
    if(!favMovies.includes(btnId.toString())){
        favMovies.push(btnId.toString());
    }

    // getting array from local storage  
    oldMovies = JSON.parse(localStorage.getItem('MovieArray'));
    if(oldMovies==null){
        // if empty 
        localStorage.setItem('MovieArray', JSON.stringify(favMovies));
    }else{
        // if not empty 
        favMovies.forEach(item=>{
            if(!oldMovies.includes(item)){
                oldMovies.push(item);
            }
        })
        // adding the movie in local storage 
        localStorage.setItem('MovieArray', JSON.stringify(oldMovies));
    }
}

// this is the search function 
search.addEventListener('keyup', function(event){
    // input char in the search box
    var input = search.value;
    // getting all the movies related to the input in the search option 
    var inputUrl = `https://api.themoviedb.org/3/search/movie?query=${input}&${APIKEY}`;
    if (event.key === "Enter") {
    if(input.length !=0){
        const searchResultsSection = document.getElementById('Searched');
            searchResultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        apiCall(inputUrl);
    }else{
        window.location.reload();
    }
}
})

// disable the prev btn when the page is 1
pBtn.disabled = true;
function disablePBtn(){
    if(pageNumber ==1)pBtn.disabled=true;
    else pBtn.disabled=false;
}

// got to next page 
nBtn.addEventListener('click',()=>{
    pageNumber++;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
});

// gor to prev page 
pBtn.addEventListener('click',()=>{
    if(pageNumber==1)return;

    pageNumber--;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
})












$(document).ready(function() {
    fetchTopMovies();
  });
  
  function fetchTopMovies() {
    $.ajax({
      url: 'https://api.themoviedb.org/3/discover/movie',
      method: 'GET',
      data: {
        api_key: 'af5fdbd002b736194b819279d9cd1c82',
        region: 'US',
        sort_by: 'popularity.desc',
        'primary_release_date.lte': new Date().toISOString().slice(0, 10),
        'primary_release_date.gte': new Date().toISOString().slice(0, 10),
      },
      success: function(response) {
        const topMovies = response.results.slice(0, 5);
        fetchMovieDetails(topMovies);
      },
      error: function(xhr, status, error) {
        console.error('Error fetching top movies:', error);
      }
    });
  }
  
  function fetchMovieDetails(movies) {
    movies.forEach(function(movie) {
      $.ajax({
        url: `https://api.themoviedb.org/3/movie/${movie.id}`,
        method: 'GET',
        data: {
          api_key: 'af5fdbd002b736194b819279d9cd1c82',
        },
        success: function(movieDetails) {
          renderMovieCard(movie, movieDetails);
        },
        error: function(xhr, status, error) {
          console.error('Error fetching movie details:', error);
        }
      });
    });
  }
  
  function renderMovieCard(movie, details) {
    const moviesContainer = $('#movies-container');
    const imageURL = `https://image.tmdb.org/t/p/w300${details.poster_path}`;
    const movieCard = $('<div class="movie-card"></div>');
  
    movieCard.append(`<img src="${imageURL}" alt="${movie.title}" />`);
    movieCard.append(`<h2>${movie.title}</h2><p>${movie.overview}</p>`);
    moviesContainer.append(movieCard);
  }
  