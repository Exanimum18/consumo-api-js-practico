// Usando Axios

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  params: {
    'api_key': API_KEY,
  },
});

// devolver el array u objeto de movies que tengamos en localStorage
function likedMoviesList() {

  // convertimos todo en string
  const item = JSON.parse(localStorage.getItem('liked-movies'));
  let movies;
  // Si hay algo devolvemos ese algo
  if (item) {
    movies = item;

  // si no hay nada devolvemos un objeto vacio
  } else {
    movies = {};
  }

  return movies
}

function likedMovie(movie) {

  const likedMovies = likedMoviesList();

  if (likedMovies[movie.id]) {

    // remover la movie de localStorage
    likedMovies[movie.id] = undefined;

  } else {

    // Agregar la movie a localStorage
    likedMovies[movie.id] = movie;
  }

  // Guardando la pelicula en favoritos y convertimos todo en un objeto
  localStorage.setItem('liked-movies', JSON.stringify(likedMovies));
}

// Helpers

// Lazy Loader
const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute('data-img')
      entry.target.setAttribute('src', url);
    }
  });
});

// esta funcion se crea para no repetir tanto codigo (DRY)
function createMovies(
  movies,
  container,
  {
    lazyLoad = false,
    clean = true,
  } = {},
  ) {
  if (clean) {
    container.innerHTML = ''; // limpiando secciones
  }

  movies.forEach(movie => {
    // estamos creando un bloque div
    const movieContainer = document.createElement('div');

    // le agregamos la clase movie-container
    movieContainer.classList.add('movie-container');

    // creamos una etiqueta de img
    const movieImg = document.createElement('img');

    // le agregamos la clase movie-img
    movieImg.classList.add('movie-img');

    // el primero seria el atributo que se le quiere agregar y el segundo seria el valor de ese atributo
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
      lazyLoad ? 'data-img' : 'src',
      'https://image.tmdb.org/t/p/w300' + movie.poster_path,
    );

    movieImg.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    });

    //Agregar imagen por defecto si alguna falla
    movieImg.addEventListener('error', () => {
      movieImg.setAttribute(
        'src',
        'https://static.platzi.com/static/images/error/img404.png',
      );
    })

    const movieBtn = document.createElement('button');
    movieBtn.classList.add('movie-btn');
    likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
    movieBtn.addEventListener('click', () => {
      // para que agregue y quete la esta clase
      movieBtn.classList.toggle('movie-btn--liked');

      // LocalStorage
      likedMovie(movie);

      // para que se agreguen las movies a favoritos sin tener que recargar la pagina
      getLikedMovies();
    })

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    // le agregamos la imagen de cada poster a la etiqueda de div
    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = "";

  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    // creamos una etiqueta de h3
    const categoryTitle = document.createElement('h3');

    // le agregamos la clase category-title
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', 'id' + category.id);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);

    // le agregamos el titulo de cada genero a la etiqueda de div
    categoryContainer.appendChild(categoryTitle);

    // le agregamos la id de categoriesPreview y la clase de categoriesPreview-list, para que aparezcan las categorias
    container.appendChild(categoryContainer);
  });
}

// Llamados a la API

// Lista de trending de peliculas
async function getTrendingMoviesPreview() {
  // ***** Axios ***** //
  const { data } = await api('trending/movie/day');
  const movies = data.results;
  // console.log(movies)

  // seleccionando el tag de trendingPreview-movieList
  createMovies(movies, trendingMoviesPreviewList, true);

   // ***** Fetch ***** //
  // const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
  // const data = await res.json()
}

// Lista de generos
async function getCategegoriesPreview() {
  const { data } = await api('genre/movie/list');
  const categories = data.genres;

  createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api('discover/movie', {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;

  // se le agrega el true para implementar el lazy load
  createMovies(movies, genericSection, { lazyLoad: true });
}

function getPaginatedMoviesByCategory(id) {
  return async function () {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api('discover/movie', {
        params: {
          with_genres: id,
          page,
        },
      });
      const movies = data.results;

      createMovies(
        movies,
        genericSection,
        { lazyLoad: true, clean: false },
      );
    }
  }
}

async function getMoviesBySearch(query) {
  const { data } = await api('search/movie', {
    params: {
      query,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;
  console.log(maxPage)

  createMovies(movies, genericSection);
}

function getPaginatedMoviesBySearch(query) {
  // implementando el scroll infinito
  return async function () {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;

    // el scroll tiene que estar al final y ademas la pagina no puede ser la ultima pagina
    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api('search/movie', {
        params: {
          query,
          page,
        },
      });
      const movies = data.results;

      createMovies(
        movies,
        genericSection,
        { lazyLoad: true, clean: false },
      );
    }
  }
}

async function getTrendingMovies() {
  const { data } = await api('trending/movie/day');
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, { lazyLoad: true, clean: true });

  // Agregando el boton de mostrar mas movies
  // const btnLoadMore = document.createElement('button')
  // btnLoadMore.innerHTML = 'Show more';
  // btnLoadMore.addEventListener('click', )
  // genericSection.appendChild(btnLoadMore)
}

// funcion para mostrar mas trending movies
async function getPaginatedTrendingMovies() {
  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement;

  const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
  const pageIsNotMax = page < maxPage;

   // el scroll tiene que estar al final y ademas la pagina no puede ser la ultima pagina
  if (scrollIsBottom && pageIsNotMax) {
    page++;
    const { data } = await api('trending/movie/day', {
      params: {
        page,
      },
    });
    const movies = data.results;

    createMovies(
      movies,
      genericSection,
      { lazyLoad: true, clean: false },
    );
  }
  // para que siga apareciendo el boton de show more
  // const btnLoadMore = document.createElement('button')
  // btnLoadMore.innerHTML = 'Show more';
  // btnLoadMore.addEventListener('click', getTPaginatedrendingMovies)
  // genericSection.appendChild(btnLoadMore)
}

async function getMovieById(id) {
  const { data: movie } = await api('movie/' + id);

  const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
  console.log(movieImgUrl)
  headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})
  `;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);

  getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
}

// funcion para consumir LocalStorage
function getLikedMovies() {
  const likedMovies = likedMoviesList();
  const moviesArray = Object.values(likedMovies);

  createMovies(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true });

  // console.log(likedMovies)
}
