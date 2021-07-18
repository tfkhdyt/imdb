$('.search-button').on('click', function () {
  $.ajax({
    url: 'https://www.omdbapi.com/?apikey=9d386d0f&s=' + $('.input-keyword').val(),
    crossDomain : true,
    success: results => {
      // console.log(results);
      const movies = results.Search;
      let cards = '';
      movies.forEach(m => {
        cards += showCard(m);
      });
      $('.movie-container').html(cards);
      $('.modal-detail-button').on('click', function () {
        $.ajax({
          url: 'https://www.omdbapi.com/?apikey=9d386d0f&i=' + $(this).data('imdbid'),
          crossDomain : true,
          success: m => {
            const movieDetail = showMovieDetail(m);
            $('.modal-body').html(movieDetail);
            $('.search-pahe').on('click', function () {
              let link = 'https://pahe.ph/?s=' + $(this).data('imdbidpahe');
              link = encodeURI(link);
              window.open(link, '_blank');
            });
          },
          error: e => {
            console.log(e.responseText);
          }
        });
      });
    },
    error: (e) => {
      console.log(e.responseText);
    }
  });
});


let showCard = m => {
  return `
  <div class="col-12 col-md-4 my-1">
    <div class="card">
      <img src="${m.Poster}" class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">${m.Title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
        <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Details</a>
      </div>
    </div>
  </div>`;
};

let showMovieDetail = m => {
  const r = m.Ratings.map(rating => {
    return `<b>${rating.Source} : </b> ${rating.Value} <br>`;
  }).join('');
  return  `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3">
          <img src="${m.Poster}" class="img-fluid">
        </div>
        <div class="col-md">
          <ul class="list-group">
            <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
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
            <li class="list-group-item"><strong>Ratings : </strong><br>${r}
            <li class="list-group-item"><strong>Box Office : </strong><br>${m.BoxOffice}
            <li class="list-group-item"><strong>Production : </strong><br>${m.Production}
            </li>
            <li class="list-group-item"><strong>Plot : </strong><br>${m.Plot}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary search-pahe" data-imdbidpahe="${m.Title}">Search on Pahe</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
};