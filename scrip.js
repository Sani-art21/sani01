const apiKey = '6588168ae942778727953e60b28ee691'; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch and display popular movies
async function fetchPopularMovies() {
    try { const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        displayMovies(data.results); 
        // tu codigo aqui: realiza una solicitud para obtener las películas populares
        // y llama a displayMovies con los resultados
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}

// Show movie details
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const movieDetails = await response.json();
        console.log("details movie", movieDetails)
        // Asumiendo que tienes un contenedor con el id "movie-details"
        const detailsContainer = document.getElementById('details');
        detailsContainer.innerHTML = `
            <h2>${movieDetails.title}</h2>
            <img src="https://image.tmdb.org/t/p/w500${movieDetails.poster_path}" alt="${movieDetails.title}">
            <p>${movieDetails.overview}</p>
            <p><strong>Fecha de lanzamiento:</strong> ${movieDetails.release_date}</p>
            <p><strong>Rating:</strong> ${movieDetails.vote_average}</p>
            
        `;
        selectedMovieId = movieDetails.id;
        document.getElementById('movie-details').classList.remove('hidden');
        // tu codigo aqui: realiza una solicitud para obtener los detalles de la película
        // y actualiza el contenedor de detalles con la información de la película
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Error en la solicitud de búsqueda');
            }
            const searchResults = await response.json();
            displayMovies(searchResults.results); 
            // tu codigo aqui: realiza una solicitud para buscar películas
            // y llama a displayMovies con los resultados de la búsqueda
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    const favoriteMovieTitle = document.querySelector('#details h2').textContent;
    const favoriteMovie = {
        id: selectedMovieId,
        title: favoriteMovieTitle
    };
    if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
        favoriteMovies.push(favoriteMovie);
        localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
        displayFavorites(); // Muestra la lista actualizada de favoritos
    }
    
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas