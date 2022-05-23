document.addEventListener("readystatechange", (e) => {
    if (e.target.readyState === "complete") {
        loadMovieList();
    }
});

import { TMDBKey } from "./api.js";

const carouselSlider = document.querySelector(".slider-content");
const heroSection = document.querySelector(".hero");
const modalShow = document.querySelector(".modal");

// get api token
// url variables
const API = TMDBKey.keyID;
const api_url = `https://api.themoviedb.org/3`;
const api_img_url = "https://image.tmdb.org/t/p/original";

// objects catergories from TMDB
const requestCat = {
    fetchNetflixOriginals: `/discover/tv?api_key=${API}&with_networks=213`,
    fetchTrending: `/trending/all/week?api_key=${API}&language=en-PH`,
    fetchTopRated: `/movie/top_rated?api_key=${API}&language=en-PH`,
    fetchActionMovies: `/discover/movie?api_key=${API}&with_genres=28`,
    fetchComedy: `/discover/movie?api_key=${API}&with_genres=35`,
    fetchHorror: `/discover/movie?api_key=${API}&with_genres=27`,
    fetchRomance: `/discover/movie?api_key=${API}&with_genres=10749`,
    fetchDocumentaries: `/discover/movie?api_key=${API}&with_genres=99`,
};

// Movies and TV Show from TMDB API
class Movies {
    // method to fetch data
    async getMoviesAndTVShowsTrending() {
        try {
            const results = await fetch(api_url + requestCat.fetchTrending);
            const data = await results.json();
            const movies = data.results;

            return movies;
        } catch (error) {
            console.log(error);
        }
    }

    async getMoviesAndTVShowsNetflixOriginal() {
        try {
            const results = await fetch(api_url + requestCat.fetchNetflixOriginals);
            const data = await results.json();
            const movies = data.results;

            return movies;
        } catch (error) {
            console.log(error);
        }
    }
}

// Render UI Compnonents such as Movie Card
class RenderUI {
    displayMoviesShows(moviesAndShows) {
        let result = "";

        moviesAndShows.forEach((element) => {
            result += `
            <div class="carousel-item">       
                     <img src="${api_img_url + element.poster_path}" alt="${
        element.title || element.original_name
      }" width="200">                                            
            </div>   
            `;
        });

        carouselSlider.insertAdjacentHTML("beforeend", result);
    }

    createHeroSection(img, title, oveview) {
        heroSection.setAttribute("style", `background-image:url(${img})`);

        const heroSectionEl = `
        <div class="hero_billboard-wrapper inner-width">
            <div class="billboard-title">
                <h1>${title}</h1>
                <p class="line-clamp-3">${oveview}</p>
               <div class="hero_btn-container">
                    <div class="billboard-links">
                        <a class="playlink-btn-anchor" href="#">
                            <button class="hero_btn-play">
                                <div><i class="fas fa-play"></i></div>
                                <div style="width:1rem;"></div>
                                <div>Play</div>
                            </button>
                        </a>
                    </div>
                    <div class="billboard-links">
                        <a class="playlink-btn-anchor" href="#">
                            <button class="hero_btn-play secondary">
                                <div><i class="fas fa-info-circle"></i></div>
                                <div style="width:1rem;"></div>
                                <div class="more-info-btn">More Info</div>
                            </button>
                        </a>
                    </div>
               </div>
            </div>

        </div>
        `;
        heroSection.insertAdjacentHTML("beforeend", heroSectionEl);
    }
}

const loadMovieList = () => {
    const renderUIComponent = new RenderUI();
    const moviesAndTV = new Movies();

    moviesAndTV.getMoviesAndTVShowsTrending().then((movies) => {
        let i = 0;
        renderUIComponent.createHeroSection(
            api_img_url + movies[i].poster_path,
            movies[i].title || movies[i].original_name,
            movies[i].overview
        );
        renderUIComponent.displayMoviesShows(movies);
    });

    moveLeftAndRight();
};

const showModalMoreInfo = () => {
    const getDataFromMovieClass = new Movies();
    const movieItemClicked = document.querySelectorAll(".carousel_carousel-item");

    let innderModalShow = "";

    getDataFromMovieClass.getMoviesAndTVShowsTrending().then((movies) => {
        movieItemClicked.forEach((clickedMovie) => {
            const movie_ID = clickedMovie.getAttribute("data-id");

            clickedMovie.addEventListener("click", () => {
                movies.forEach((data) => {
                    if (parseInt(movie_ID) === data.id) {
                        innderModalShow = `
                        <div class="modal_inner-wrapper">
                            <div class="movie-backdrop-img-wrapper" style="background-image: URL(${
                              api_img_url + data.backdrop_path
                            })">
                                <div class="movie-heading-wrapper">
                                    <!-- title -->
                                    <header>
                                        <h1 class="modal__movie-title">${
                                          data.original_title ||
                                          data.original_name
                                        }</h1>
                                    </header>
                    
                                    <!-- play this movie/show  -->
                                    <div class="play-wapper">
                                        <button class="button play-movie-btn">Play</button>
                                    </div>
                                </div>
                                <div class="close-modal" id="close-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </div>
                            </div>        
                            <div class="excerpt col-2">
                               <div class="summary-wrapper">
                                  <h2>Summary</h2>
                                  <p>${data.overview}</p>
                               </div>
                               <div class="release-year">
                                  <p class="yr-released">Year Released: ${
                                    data.release_date || data.first_air_date
                                  }</p>
                                  <p class="yr-released">Type: ${
                                    data.media_type || "TV Show"
                                  }</p>
                               </div>
                            </div>
                        </div>
                        `;
                        modalShow.classList.add("opened");
                        modalShow.insertAdjacentHTML("beforeend", innderModalShow);
                        closeModal();
                    }
                });
            });
        });
    });
};

const closeModal = () => {
    const closeModal = document.querySelector("#close-icon");
    closeModal.addEventListener("click", () => {
        modalShow.classList.remove("opened");
        modalShow.replaceChildren();
    });
};

const moveLeftAndRight = () => {
    document.addEventListener("click", (e) => {
        let handle;
        if (e.target.matches(".handle")) {
            handle = e.target;
        } else {
            handle = e.target.closest(".handle");
        }
        if (handle != null) {
            onHandleClick(handle);
        }
    });
};


const sliderContent = document.querySelector(".slider-content");
const contentsArray = sliderContent.children;
let isTouched = false;

const onHandleClick = (handle) => {
    const slider = handle.closest('.slider').querySelector('.slider-mask')

    const sliderIndex = parseInt(getComputedStyle(slider).getPropertyValue('--slider-index'));

    if (handle.classList.contains("handle-previous")) {
        slider.style.setProperty('--slider-index', sliderIndex - 1)
        nextTouched();
    }
    if (handle.classList.contains("handle-next")) {
        slider.style.setProperty('--slider-index', sliderIndex + 1)
        nextTouched();
    }
};


const nextTouched = () => {
    const contents = Array.from(contentsArray);
    const getSplice = contents.splice(0, 4);
    const newChild = contents.concat(getSplice);

    var i;
    for (i = 0; i < contents.length; i++) {
        contents[i].classList.remove("is-active");
    }

    var j;
    for (j = 4; j < newChild.length && j < 8; j++) {
        newChild[j].classList.add("is-active");
    }

    for (let len = contentsArray.length - 1; len >= 0; --len) {
        sliderContent.insertBefore(newChild[len], sliderContent.firstChild)
        console.log(sliderContent.insertBefore(newChild[len], sliderContent.firstChild));
    }
};