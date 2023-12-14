// this is the api key, base url and image url
const APIKEY = 'api_key=af5fdbd002b736194b819279d9cd1c82';
const BASEURL = 'https://api.themoviedb.org/3';
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

// getting the movie id and details
let id = '';
const urlParams = new URLSearchParams(location.search);
for(const [key, value] of urlParams){
    id = value;
}

let link = `/movie/${id}?language=en-US&append_to_response=videos,credits&`;
let f_url = BASEURL + link + APIKEY;

apiCall(f_url);

// function to create element 
function apiCall(url){
    const x = new XMLHttpRequest();
    x.open('get', url);
    x.send();
    x.onload = function(){
        document.getElementById('movie-display').innerHTML = '';
        var res = x.response;
        var Json = JSON.parse(res);
        getMovies(Json);
    };
    x.onerror = function(){
        window.alert('cannot get');
    };
}

// Fetch actor details including the image by their ID
async function fetchActorDetails(actorId) {
    try {
        const response = await fetch(`${BASEURL}/person/${actorId}?${APIKEY}`);
        const actorData = await response.json();
        return actorData;
    } catch (error) {
        console.error('Error fetching actor details:', error);
        return {};
    }
}

// this function takes the JSON data and displays it on the movie details page 
async function getMovies(myJson){
    // get the movie youtube link 
    var MovieTrailer = myJson.videos.results.filter(filterArray);
    // get the background image for the page 
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${IMAGEURL + myJson.backdrop_path})`;
    document.body.style.backgroundSize = 'cover'; // Cover entire viewport
    document.body.style.backgroundAttachment = 'fixed'; // Fix background when scrolling
    var movieDiv = document.createElement('div');
    movieDiv.classList.add('each-movie-page');

    // Get the list of actors from the API response
    // Get the list of first 10 actors from the API response
    const actors = myJson.credits.cast.slice(0, 10).map(actor => actor.name).join(', ');
    const genres = myJson.genres.map(genre => genre.name).join(', ');
const directors = myJson.credits.crew.filter(member => member.job === 'Director').map(director => director.name).join(', ');

// Get the list of writers from the API response
const writers = myJson.credits.crew.filter(member => member.department === 'Writing').map(writer => writer.name).join(', ');
    const topActors = myJson.credits.cast.slice(0, 10);

    const actorsDiv = document.createElement('div');
    actorsDiv.classList.add('top-actors');



    // setting the youtube link 
    var youtubeURL;
    if(MovieTrailer.length == 0){
        if(myJson.videos.results.length == 0){
            youtubeURL = '';
        } else {
            youtubeURL = `https://www.youtube.com/embed/${myJson.videos.results[0].key}`;
        }
    } else {
        youtubeURL = `https://www.youtube.com/embed/${MovieTrailer[0].key}`;
    }

    // HTML for the movie details page 
    movieDiv.innerHTML = `
        <div class="movie-poster">
            <img src=${IMAGEURL + myJson.poster_path} alt="Poster">
        </div>
        <div class="movie-details">
            <div class="title">
                ${myJson.title}
            </div>

            <div class="tagline">${myJson.tagline}</div>

            <div style="display: flex;"> 
                <div class="movie-duration">
                    <b><i class="fas fa-clock"></i></b> ${myJson.runtime}
                </div>
                <div class="release-date">
                    <b>Released</b>: ${myJson.release_date}
                </div>
            </div>

            <div class="rating">
                <b>IMDb Rating</b>: ${myJson.vote_average}
            </div>

            <div class="actors">
                <b>Actors</b>: ${actors}
                <div class="genres">
                <br>
            <b>Genres</b>: ${genres}
        
        <br>
        <div class="directors">
            <b>Directors</b>: ${directors}
        </div>
        <div class="writers">
        <b>Writers</b>: ${writers}
    </div>
            </div>
    <span>Offical Trailer: </span>
            <div class="trailer-div" id="trailer-div-btn">
                <i class="fab fa-youtube"></i>
            </div>

            <div id="trailer-video-div">
                <button id="remove-video-player"><i class="fas fa-times"></i></button>
                <br>
                <span><iframe width="560" height="315" src=${youtubeURL} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></span>
            </div>
    
            <div class="plot">
                ${myJson.overview}
                <h2>Cast: </h2>
            </div>
            <br>
            <div class="actors-section">

            <div class="actors-posters"></div>
        </div>
        <br>
        <!-- Actors section -->

        </div>
    `;

    document.getElementById('movie-display').appendChild(movieDiv);

    // play the youtube video 
    var youtubeVideo = document.getElementById('trailer-video-div');
    document.getElementById('trailer-div-btn').addEventListener('click', function(){
        youtubeVideo.style.display = 'block';
    });
    // stop the youtube video 
    document.getElementById('remove-video-player').addEventListener('click', function(){
        stopVideo();
        youtubeVideo.style.display = 'none';
    });

    // function to stop the youtube Video
    function stopVideo(){
        var iframe = document.getElementsByTagName("iframe")[0];
        var url = iframe.getAttribute('src');
        iframe.setAttribute('src', '');
        iframe.setAttribute('src', url);
    }
// Inside the getMovies function after creating the movieDiv
// Inside the getMovies function after creating the movieDiv
// Inside the getMovies function after creating the movieDiv
// Inside the getMovies function after creating the movieDiv
const actorsPostersDiv = document.createElement('div');
actorsPostersDiv.classList.add('actors-posters');

for (const actor of topActors) {
    const actorElement = document.createElement('div');
    actorElement.classList.add('actor-poster');

    const actorImg = document.createElement('img');
    const actorDetails = await fetchActorDetails(actor.id); // Fetch actor details including the image

    if (actorDetails.profile_path) { // Check if profile path exists
        actorImg.src = `${IMAGEURL}${actorDetails.profile_path}`; // Use the actor's profile path for the image
        actorImg.alt = actor.name;

        actorImg.addEventListener('click', () => {
            // Redirect to the actor details page with necessary information (e.g., actor ID)
            window.location.href = `actorDetails.html?id=${actor.id}`;
        });

        actorElement.appendChild(actorImg);
        actorsPostersDiv.appendChild(actorElement);
    }
}

// Insert the actors' posters after the plot section
const plotElement = document.querySelector('.plot');
plotElement.parentNode.insertBefore(actorsPostersDiv, plotElement.nextSibling);

// Get actor ID from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const actorId = urlParams.get('id'); // Assuming the actor ID is passed as 'id' in the URL

// Fetch actor details including biography and date of birth
const actorDetailsResponse = await fetch(`${BASEURL}/person/${actorId}?${APIKEY}`);
const actorDetailsData = await actorDetailsResponse.json();

// Fetch the list of known movies for the actor
const knownMoviesResponse = await fetch(`${BASEURL}/person/${actorId}/movie_credits?${APIKEY}`);
const knownMoviesData = await knownMoviesResponse.json();
const knownMovies = knownMoviesData.cast.slice(0, 4); // Limit to the first 4 known movies

// Display actor details on the page
const actorNameElement = document.querySelector('.actor-info .actor-name');
actorNameElement.textContent = actorDetailsData.name;

const actorPosterElement = document.querySelector('.actor-poster img');
actorPosterElement.src = `${IMAGEURL}${actorDetailsData.profile_path}`;
actorPosterElement.alt = actorDetailsData.name;

const dateOfBirthElement = document.querySelector('.date-of-birth');
dateOfBirthElement.textContent = actorDetailsData.birthday;

const biographyElement = document.querySelector('.biography');
biographyElement.textContent = actorDetailsData.biography;

// Display list of known movies
const knownMoviesDiv = document.querySelector('.known-movies');
knownMovies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.textContent = movie.title;
    knownMoviesDiv.appendChild(movieElement);
});


}

// filter array for video 
function filterArray(obj){
    var vtitle = obj.name;
    var rg = /Official Trailer/i;
    if(vtitle.match(rg)){
        return obj;
    }
}
