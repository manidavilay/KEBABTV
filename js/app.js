document.addEventListener('DOMContentLoaded', ()=> {

    // Déclarations

    const theMovieDBUrl = 'https://api.themoviedb.org/3/search/movie?api_key=6fd32a8aef5f85cabc50cbec6a47f92f&query='
    const apiUrl = 'https://kebabtv.dwsapp.io'
    
    const searchForm = document.querySelector('#searchMovie');
    const searchData = document.querySelector('[name="searchData"]');

    const movieList = document.querySelector('#movieList');
    const moviePopin = document.querySelector('#moviePopin');

    const favoriteList = document.querySelector('#favorite ul');


    // Fonctions
    const checkUserToken = () => {
        new FETCHrequest (
            `${apiUrl}/api/me/${localStorage.getItem('user-token')}`,
            'GET'
        )

        .sendRequest()
        .then(jsonData => console.log(jsonData))
        .catch(jsonError => console.log(jsonError))
    }

    const me = () => {

        new FETCHrequest(
            `${apiUrl}/api/me`,
            'POST',
            { 
                token: localStorage.getItem('user-token') 
            }
        )

        .sendRequest()
        .then(jsonData => {
            displayFavorite(jsonData.data.favorite)
        })
        .catch(jsonError => console.log(jsonError))
    };

    const searchMovie = keyword => {

        searchForm.addEventListener('submit', event => {
            event.preventDefault();

            new FETCHrequest (

                `${theMovieDBUrl}${searchData.value}&page=1` + keyword,
                'GET',
            )

            .sendRequest()
            .then(jsonData => {
                console.log(jsonData)
                displayMovieList(jsonData.results);
            })
            .catch(jsonError => console.log(jsonError))
        })
    }

    const displayMovieList = collection => {

        searchData.value = '';
        movieList.innerHTML = ''; 
        for (let item of collection) {
            movieList.innerHTML += `
                <article class="column column-25">
                    <div class="wrapper">
                        <figure>
                            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.original_title}">
                            <figcaption>${item.vote_average}</figcaption>
                        </figure>
                        <p class="title" movie-id="${item.id}">${item.title}</p>
                    </div>
                    <div class="card">
                            <p>${item.overview}</p>
                            <button>Voir le film</button>
                        </div>
                </article>
            `;
        }

        getPopinLink(document.querySelectorAll('p.title'));
    }

    const getPopinLink = linkCollection => {

        for (let link of linkCollection) {
            link.addEventListener('click', () => {
                new FETCHrequest(
                    `https://api.themoviedb.org/3/movie/${link.getAttribute('movie-id')}?api_key=6fd32a8aef5f85cabc50cbec6a47f92f`, 
                    'GET'
                )

                .sendRequest()
                .then(jsonData => {
                    displayPopin(jsonData)
                })
                .catch(jsonError => console.log(jsonError))
                
            });
        };
    };

    const displayPopin = data => {
        moviePopin.innerHTML = `
            <div>
                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.original_title}">
            </div>
            <div>
                <h2>${data.title}</h2>
                <p>${data.overview}</p>
                <button>Voir en streaming</button>
                <button id="addFilm" film-id="${data.id}" film-title="${data.title}">Ajouter en favori</button>
                <button id="closeButton">Close</button>
            </div>
        `;
        moviePopin.classList.add('opened');
        closePopin( document.querySelector('#closeButton'));
        addFavoriteMovie(document.querySelector('#addFilm'));
    }

    const closePopin = button => {
        button.addEventListener('click', ()=>{
            moviePopin.classList.remove('opened');
        })
    }

    const addFavoriteMovie = (btn) => {

        btn.addEventListener('click', event => {
            event.preventDefault();

            new FETCHrequest (
                `${apiUrl}/api/favorite`,
                'POST',
                {
                    id: btn.getAttribute('film-id'), 
                    title: btn.getAttribute('film-title'), 
                    token: localStorage.getItem('user-token') 
                }
            )
    
            .sendRequest()
            .then(jsonData => {
                console.log(jsonData)
            })
            .catch(jsonError => console.log(jsonError))
            
        })
    }

    const displayFavorite = data => {
        favoriteList.innerHTML = '';
        for (let item of data) {
            favoriteList.innerHTML += `
                <li>
                    <button class="eraseFavorite" movie-id="${item._id}"><i class="fas fa-eraser"></i></button>
                    <span movie-id="${item.id}">${item.title}</span>
                </li>
            `;
        };

        deleteFavorite(document.querySelectorAll('.eraseFavorite'))
    }

    const deleteFavorite = favorites => {
        for (let item of favorites) {

            item.addEventListener('click', () => {

                new FETCHrequest (
                    `${apiUrl}/api/favorite/${item.getAttribute('movie-id')}`,
                    'DELETE', 
                    {
                        token: localStorage.getItem('user-token') 
                    }
                )

                .sendRequest()
                .then(jsonData => {
                    checkUserToken()
                    console.log(jsonData)
                })
                .catch(jsonError => console.log(jsonError))
            })
        }
    }

    if (localStorage.getItem('user-token') !== null) {
        me();
    }

    // Lancer fonction
    searchMovie();
});