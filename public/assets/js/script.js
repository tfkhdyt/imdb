const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', async function () {
  let inputKeyword = document.querySelector('.input-keyword');
  inputKeyword = encodeURIComponent(inputKeyword.value);
  const movies = await getMovies(inputKeyword);
  updateUI(movies);
});

document.addEventListener('click', async function (e) {
  if (e.target.classList.contains('modal-detail-button')) {
    const imdbid = e.target.dataset.imdbid;
    const movieDetail = await getMovieDetail(imdbid);
    updateUIDetail(movieDetail);
    const listGroupItem = document.querySelectorAll('.list-group-item');
    listGroupItem.forEach((item) => {
      if (
        item.textContent.includes('N/A') ||
        item.textContent.includes('undefined')
      ) {
        item.classList.add('d-none');
      }
    });
    if (movieDetail.Ratings.length == 0) {
      const listGroupItem = document.querySelectorAll('.list-group-item');
      listGroupItem.forEach((e) => {
        if (e.id == 'ratings') {
          e.classList.add('d-none');
        }
      });
    }
    linkToPahe();
  }
});

const getMovieDetail = (imdbid) => {
  return fetch('https://www.omdbapi.com/?apikey=9d386d0f&i=' + imdbid)
    .then((response) => response.json())
    .then((m) => m);
};

const linkToPahe = () => {
  const searchPahe = document.querySelector('.search-pahe');
  searchPahe.addEventListener('click', function () {
    let link = 'https://pahe.ph/?s=' + this.dataset.imdbidpahe;
    link = encodeURI(link);
    window.open(link, '_blank');
  });
};

const updateUIDetail = (m) => {
  const movieDetail = showMovieDetail(m);
  const modalBody = document.querySelector('.modal-body');
  const modalFooter = document.querySelector('.modal-footer');
  modalBody.innerHTML = movieDetail;
  modalFooter.innerHTML = showModalFooter(m);
};

const getMovies = (keyword) => {
  return fetch('https://www.omdbapi.com/?apikey=9d386d0f&s=' + keyword)
    .then((response) => response.json())
    .then((response) => response.Search);
};

const updateUI = (movies) => {
  let cards = '';
  movies.forEach((m) => (cards += showCard(m)));
  const movieContainer = document.querySelector('.movie-container');
  movieContainer.innerHTML = cards;
};

const showCard = (m) => {
  return `
  <div class="col-12 col-md-4 my-1">
  <div class="card">
  <img src="${m.Poster}" class="card-img-top">
  <div class="card-body">
  <h5 class="card-title">${m.Title}</h5>
  <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
  <a href="#" class="btn btn-primary modal-detail-button col-12" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}"><i class="fas fa-info-circle"></i> Show Details</a>
  </div>
  </div>
  </div>`;
};

const showMovieDetail = (m) => {
  const r = m.Ratings.map((rating) => {
    return `<b>${rating.Source} : </b> ${rating.Value} <br>`;
  }).join('');
  return `
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3">
        <img src="${m.Poster}" class="img-fluid">
      </div>
      <div class="col-md">
        <ul class="list-group">
          <li class="list-group-item"><h5>${m.Title} (${m.Year})</h5></li>
          <li class="list-group-item"><strong>Rated : </strong>${m.Rated}</li>
          <li class="list-group-item"><strong>Released : </strong>${m.Released}</li>
          <li class="list-group-item"><strong>Runtime : </strong>${m.Runtime}</li>
          <li class="list-group-item"><strong>Genre : </strong>${m.Genre}</li>
          <li class="list-group-item"><strong>Director : </strong>${m.Director}</li>
          <li class="list-group-item"><strong>Actor : </strong>${m.Actors}</li>
          <li class="list-group-item"><strong>Writer : </strong>${m.Writer}</li>
          <li class="list-group-item"><strong>Language : </strong>${m.Language}</li>
          <li class="list-group-item"><strong>Country : </strong>${m.Country}</li>
          <li class="list-group-item"><strong>Awards : </strong>${m.Awards}</li>
          <li class="list-group-item" id="ratings">${r}
          <li class="list-group-item"><strong>Box Office : </strong>${m.BoxOffice}
          <li class="list-group-item"><strong>Production : </strong>${m.Production}
          </li>
          <li class="list-group-item"><strong>Plot : </strong><br>${m.Plot}</li>
        </ul>
      </div>
    </div>
  </div>`;
};

const showModalFooter = (m) => {
  return `
    <button type="button" class="btn btn-primary search-pahe" data-imdbidpahe="${m.imdbID}"><i class="fas fa-search"></i> Search on Pahe</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times-circle"></i> Close</button>
  `;
};
