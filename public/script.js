/*$('.search-button').on('click', function () {
  $.ajax({
    url: 'https://www.omdbapi.com/?apikey=9d386d0f&s=' + $('.input-keyword').val(),
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
*/

//fetch
const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', function () {
  const inputKeyword = document.querySelector('.input-keyword');
  fetch('https://www.omdbapi.com/?apikey=9d386d0f&s=' + inputKeyword.value)
  .then(response => response.json())
  .then(response => {
    const movies = response.Search;
    let cards = '';
    movies.forEach(m => cards += showCard(m));
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = cards;

    const modalDetailButton = document.querySelectorAll('.modal-detail-button');
    modalDetailButton.forEach(btn => {
      btn.addEventListener('click', function () {
        const imdbid = this.dataset.imdbid;
        fetch('https://www.omdbapi.com/?apikey=9d386d0f&i=' + imdbid)
        .then(response => response.json())
        .then(m => {
          const movieDetail = showMovieDetail(m);
          const modalBody = document.querySelector('.modal-body');
          modalBody.innerHTML = movieDetail;
          
          const listGroupItem = document. querySelectorAll('.list-group-item');
          listGroupItem.forEach(item => {
            if (item.textContent.includes('N/A') || item.textContent.includes('undefined')){
              item.classList.add('d-none');
            }
          });

          const searchPahe = document.querySelector('.search-pahe');
          searchPahe.addEventListener('click', function () {
            let link = 'https://pahe.ph/?s=' + this.dataset.imdbidpahe;
            link = encodeURI(link);
            window.open(link, '_blank');
          });
        });
      });
    });
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
<a href="#" class="btn btn-primary modal-detail-button col-12" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}"><i class="fas fa-info-circle"></i> Show Details</a>
</div>
</div>
</div>`;
};

let showMovieDetail = m => {
const r = m.Ratings.map(rating => {
return `<b>${rating.Source} : </b> ${rating.Value} <br>`;
}).join('');
let paheId = m.Title;
paheId += (m.Type == 'movie' ? ` (${m.Year})`: '');
return  `
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
<li class="list-group-item"><strong>Ratings : </strong><br>${r}
<li class="list-group-item"><strong>Box Office : </strong>${m.BoxOffice}
<li class="list-group-item"><strong>Production : </strong>${m.Production}
</li>
<li class="list-group-item"><strong>Plot : </strong><br>${m.Plot}</li>
</ul>
</div>
</div>
</div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-primary search-pahe" data-imdbidpahe="${paheId}"><i class="fas fa-search"></i> Search on Pahe</button>
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times-circle"></i> Close</button>`;
};