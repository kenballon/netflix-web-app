document.addEventListener('readystatechange', e => {
    if(e.target.readyState === 'complete')
    loadMovieList();        
})


import { TMDBKey } from "./api.js";

const carouselSlider = document.querySelector(".carousel");
const carouselSliderNetflix = document.querySelector(".netflix-carousel");
const heroSection = document.querySelector(".hero");

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
            <div class="carousel_carousel-item" data-target="card-item">       
                     <img src="${api_img_url + element.poster_path}" alt="${
        element.title || element.original_name
      }" width="200">                                            
            </div>   
            `;
    });

    carouselSlider.insertAdjacentHTML("beforeend", result);
  }

  displayNetflixOriginal(moviesAndShows) {
    let result = "";

    moviesAndShows.forEach((element) => {
      result += `
            <div class="carousel_carousel-item" data-target="card-item">       
                     <img src="${api_img_url + element.poster_path}" alt="${
        element.title || element.original_name
      }" width="200">                            
            </div>   
            `;
    });

    carouselSliderNetflix.insertAdjacentHTML("beforeend", result);
  }

  createHeroSection(img, title, oveview) {
    heroSection.setAttribute("style", `background-image:url(${img})`);

    const heroSectionEl = `
        <div class="hero_billboard-wrapper inner-width">
            <div class="billboard-title">            
                <h1>${title}</h1>
                <p>${oveview}</p>
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
    console.log(movies.slice(0,5))
    renderUIComponent.createHeroSection(
      api_img_url + movies[i].poster_path,
      movies[i].title || movies[i].original_name,
      movies[i].overview
    );
    renderUIComponent.displayMoviesShows(movies);
  });

  moviesAndTV.getMoviesAndTVShowsNetflixOriginal().then((netflixOriginal) => {
    renderUIComponent.displayNetflixOriginal(netflixOriginal);
  });

  // make header sticky when scroll
  window.onscroll = function () {
    headerScrollSticky();
  };
  const header = document.querySelector(".header");
  const sticky = header.offsetTop;

  function headerScrollSticky() {
    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

  // show menu on mobile view
  const menu = document.getElementById("mobile-menu");
  const menuOverlay = document.querySelector(".menu-pop-container");

  menu.addEventListener("click", () => {
    menuOverlay.classList.add("popup-menu");
  });
  menuOverlay.addEventListener("click", () => {
    menuOverlay.classList.remove("popup-menu");
  });
};
