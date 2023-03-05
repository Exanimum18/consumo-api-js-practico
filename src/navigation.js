searchFormBtn.addEventListener('click', () => {
  location.hash = '#search=' + searchFormInput.value; //Al presionar el boton nos llevara a search
});

trendingBtn.addEventListener('click', () => {
  location.hash = '#trends' //Al presionar el boton nos llevara a trends
});

arrowBtn.addEventListener('click', () => {
  history.back()
  // location.hash = '#home' //Al presionar el boton nos llevara a home
});

window.addEventListener('DOMContentLoaded', navigator, false)
window.addEventListener('hashchange', navigator, false)

function navigator() {
  console.log(location);

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
}

function homePage() {
  console.log('HOME!!!');

  headerSection.classList.remove('header-container--long')
  headerSection.style.background = '';
  arrowBtn.classList.add('inactive');// para que la flecha no aparezca en el home
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.remove('inactive')
  headerCategoryTitle.classList.add('inactive')// para que solo salga en la lista de categorias
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');

  getTrendingMoviesPreview();
  getCategoriesPreview();
}

function trendsPage() {
  console.log('TRENDS!!!')
  headerSection.classList.remove('header-container--long')
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.remove('inactive')
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  headerCategoryTitle.innerHTML = 'Tendencias';

  getTrendingMovies();
}

function searchPage() {
  console.log('SEARCH!!!')

  headerSection.classList.remove('header-container--long')
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.add('inactive')
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  // [#'search', 'buscado']
  const [_, query] = location.hash.split('='); // convertir en array lo que este en string y que separe en una posicion lo que venga antes del = y despues lo que se pone de busqueda
  getMoviesBySearch(query);
}

function movieDetailsPage() {
  console.log('MOVIES!!!')

  headerSection.classList.add('header-container--long')
  // headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.add('header-arrow--white');
  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.add('inactive')
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');


  // [#'movie', 'id']
  const [_, movieId] = location.hash.split('='); // convertir en array lo que este en string y que separe en una posicion lo que venga antes del = y despues lo que se pone de busqueda
  getMovieById(movieId);
}

function categoriesPage() {
  console.log('CATEGORIES!!!')

  headerSection.classList.remove('header-container--long')
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');// para que la flecha aparezca
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive') // para quitar el titulo de platzi movie
  headerCategoryTitle.classList.remove('inactive') // Agregar la categoria de la pelicula
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');// para esconder la seccion de trending movies
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, categoryData] = location.hash.split('=');
  const [categoryId, categoryName] = categoryData.split('-');

  headerCategoryTitle.innerHTML = categoryName // que muestre el nombre de la categoria en el title

  getMoviesByCategory(categoryId);
}
