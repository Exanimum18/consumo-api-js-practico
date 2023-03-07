let maxPage;
let page = 1;
let infiniteScroll;

searchFormBtn.addEventListener('click', () => { //Al presionar el boton nos llevara a search
  location.hash = '#search=' + searchFormInput.value;
});

trendingBtn.addEventListener('click', () => {
  location.hash = '#trends'; //Al presionar el boton nos llevara a trends
});

arrowBtn.addEventListener('click', () => {
  history.back();
  // location.hash = '#home';
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
// Agregando el evento de scroll
window.addEventListener('scroll', infiniteScroll, false);

function navigator() {
  console.log({ location });

  // mirar si infinite scroll tiene algo si es asi que lo quite
  if (infiniteScroll) {
    window.removeEventListener('scroll', infiniteScroll, { passive: false });
    infiniteScroll = undefined;
  }

  if (location.hash.startsWith('#trends')) {
    trendsPage();
  } else if (location.hash.startsWith('#search=')) {
    searchPage();
  } else if (location.hash.startsWith('#movie=')) {
    movieDetailsPage();
  } else if (location.hash.startsWith('#category=')) {
    categoriesPage();
  } else {
    homePage();
  }

  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  if (infiniteScroll) {
    window.addEventListener('scroll', infiniteScroll, { passive: false });
  }
}

function homePage() {
  console.log('Home!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('inactive'); // para que la flecha no aparezca en el home
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.remove('inactive');
  headerCategoryTitle.classList.add('inactive'); // para que solo salga en la lista de categorias
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  likedMoviesSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');

  getTrendingMoviesPreview();
  getCategegoriesPreview();

  // Llamando las peliculas favoritas de localStorage
  getLikedMovies();
}

function categoriesPage() {
  console.log('categories!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive'); // para que la flecha aparezca
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive'); // para quitar el titulo de platzi movie
  headerCategoryTitle.classList.remove('inactive'); // Agregar la categoria de la pelicula
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive'); // para esconder la seccion de trending movies
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  // ['#category', 'id-name']
  const [_, categoryData] = location.hash.split('=');
  const [categoryId, categoryName] = categoryData.split('-');

  headerCategoryTitle.innerHTML = categoryName; // que muestre el nombre de la categoria en el title

  getMoviesByCategory(categoryId);

  infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}

function movieDetailsPage() {
  console.log('Movie!!');

  headerSection.classList.add('header-container--long');
  // headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.add('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');

  // ['#movie', 'id']
  // convertir en array lo que este en string y que separe en una posicion lo que venga antes del = y despues lo que se pone de busqueda
  const [_, movieId] = location.hash.split('=');
  getMovieById(movieId);
}

function searchPage() {
  console.log('Search!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  // ['#search', 'platzi']
  const [_, query] = location.hash.split('=');
  getMoviesBySearch(query);

  infiniteScroll = getPaginatedMoviesBySearch(query);
}

function trendsPage() {
  console.log('TRENDS!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  headerCategoryTitle.innerHTML = 'Tendencias';

  getTrendingMovies();

  // Scroll
  infiniteScroll = getPaginatedTrendingMovies;
}
