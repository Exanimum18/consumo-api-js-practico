// Usando axios
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY,
  }
});

//Helpers

// esta funcion se crea para no repetir tanto codigo (DRY)
function createMovies(movies, container) {
  container.innerHTML = ''; // limpiando secciones
  movies.forEach(movie => {
    const movieContainer = document.createElement('div'); // estamos creando un bloque div
    movieContainer.classList.add('movie-container'); // le agregamos la clase movie-container
    movieContainer.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    })

    const movieImg = document.createElement('img');// creamos una etiqueta de img
    movieImg.classList.add('movie-img'); // le agregamos la clase movie-img
    movieImg.setAttribute('alt', movie.title); // el primero seria el atributo que se le quiere agregar y el segundo seria el valor de ese atributo
    movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path); // le agregamos el src a la etiqueta de img para que agregue los posters de las peliculas

    movieContainer.appendChild(movieImg); // le agregamos la imagen de cada poster a la etiqueda de div
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = ''; // limpiando secciones

  categories.forEach(category => {

    const categoryContainer = document.createElement('div'); // estamos creando un bloque div
    categoryContainer.classList.add('category-container'); // le agregamos la clase category-container

    const categoryTitle = document.createElement('h3');// creamos una etiqueta de h3
    categoryTitle.classList.add('category-title'); // le agregamos la clase category-title
    categoryTitle.setAttribute('id', 'id' + category.id); // el primero seria el atributo que se le quiere agregar y el segundo seria el valor de ese atributo
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name)

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle); // le agregamos el titulo de cada genero a la etiqueda de div
    container.appendChild(categoryContainer);// le agregamos la id de categoriesPreview y la clase de categoriesPreview-list, para que aparezcan las categorias
  });
}

// Lamados a la API

// Lista de trending de peliculas
async function getTrendingMoviesPreview() {
  // ***** Axios ***** //
  const {data} = await api('trending/movie/day');
  const movies = data.results

  createMovies(movies, trendingMoviesPreviewList); // seleccionando el tag de trendingPreview-movieList
  // ***** Fetch ***** //
  // const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
  // const data = await res.json()
}

// Lista de generos
async function getCategoriesPreview() {
  // ***** Usando axios ***** //
  const {data} = await api('genre/movie/list');
  const categories = data.genres

  // ***** Usando fetch ***** //
  // const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);
  // const data = await res.json()
  categoriesPreviewList.innerHTML = "";
  createCategories(categories, categoriesPreviewList)
}

async function getMoviesByCategory(id) {
  // ***** Axios ***** //
  const {data} = await api('discover/movie', {
    params: {
      with_genres: id,
    }
  });

  const movies = data.results

  createMovies(movies, genericSection);
}

async function getMoviesBySearch(query) {
  // ***** Axios ***** //
  const {data} = await api('search/movie', {
    params: {
      query,
    }
  });

  const movies = data.results

  createMovies(movies, genericSection);
}

async function getTrendingMovies() {
  // ***** Axios ***** //
  const {data} = await api('trending/movie/day');
  const movies = data.results

  createMovies(movies, genericSection); // seleccionando el tag de trendingPreview-movieList
  // ***** Fetch ***** //
  // const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
  // const data = await res.json()
}

async function getMovieById(id) {

  const { data: movie } = await api('movie/' + id);

  const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
  headerSection.style.background = `linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.35) 19.27%,
    rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})
  `;

  movieDetailTitle.textContent = movie.title ;
  movieDetailDescription.textContent = movie.overview ;
  movieDetailScore.textContent = movie.vote_average ;

  createCategories(movie.genres, movieDetailCategoriesList)

  getRelatedMoviesId(id)
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
}
