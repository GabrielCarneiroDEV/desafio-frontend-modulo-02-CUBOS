const root = document.querySelector('body');
const  movies = document.querySelector('.movies');
const input = document.querySelector('.input');
const imgModal = document.querySelector('.modal__img');
const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal__title');
const modalGenresAverage = document.querySelector('.modal__genre-average');
const modalDescription = document.querySelector('.modal__description');
const modalGenres = document.querySelector('.modal__genres');
const modalAverage = document.querySelector('.modal__average');
const highlightMovie = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightVideo = document.querySelector('.highlight__video-link');
const btnDarkOuLight = document.querySelector('.btn-theme');
let allMovies = {};
const nextBtn = document.querySelector('.btn-next');
const prevBtn = document.querySelector('.btn-prev');
let contentController = 0;
let controller = 0;
let movieId = [];


//INICIAR 
function inicializar (){

    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(function (response){

        const promiseBody = response.json();

        promiseBody.then(function (body){

            allMovies = body.results;
            moviesView(controller);

        });
    });
}

function moviesView(moviesController){

    console.log("voltei");

    movieId = [];


    if(contentController >= 1){
        const movie = document.querySelectorAll('.movie');
        for(i of movie){
            i.remove();
        }
    }

    for(let i = moviesController, j = 0; j <= 4; j++, i++){

        movieId.push(allMovies[i].id);
        
        const movie = document.createElement('div');
        movie.classList.add('movie');
        movie.style.backgroundImage =`url(${allMovies[i].poster_path})`;

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie__info');

        const movieTitle = document.createElement('span');
        movieTitle.classList.add('movie__title');
        movieTitle.textContent = allMovies[i].original_title;

        const movieRating = document.createElement('span');
        movieRating.classList.add('movie__rating');
        movieRating.textContent = allMovies[i].vote_average;

        const star = document.createElement('img');
        star.src = "./assets/estrela.svg";
    
        movieRating.append(star);
        movieInfo.append(movieTitle, movieRating);
        movie.append(movieInfo);
        movies.append(movie);

    
        movie.addEventListener('click', (event) =>{

            abrirModal(movieId[j]);
        

        });
    
    
    }   
}

//MODAL
function abrirModal(id){
   
    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`).then(function (responseModal){

        const promiseBodyModal = responseModal.json();

        promiseBodyModal.then(function(bodyModal){

            modalTitle.textContent =  bodyModal.original_title;
            imgModal.src  = bodyModal.backdrop_path ?? bodyModal.poster_path;
            console.log(imgModal.style.backgroundImage)
            console.log(bodyModal.poster_path)
            modalDescription.textContent = bodyModal.overview;
            modalAverage.textContent = bodyModal.vote_average;
                            
            for(let i of bodyModal.genres){                            
                            
                const modalGenre = document.createElement('span');
                modalGenre.classList.add('modal__genre');
                modalGenre.textContent = i.name;
                modalGenres.append(modalGenre);
                       
            }
                          
                       
            modal.classList.remove("hidden");
            modal.classList.add("modal");

            modal.addEventListener('click', () =>{

                modal.classList.add("hidden");
                modal.classList.remove("modal");
                const modalGenre = document.querySelectorAll('.modal__genre');
         
                for(let i = 0; i < modalGenre.length; i++){

                    modalGenre[i].remove();

                }
            });
        });
    });
  
}

//PESQUISAR
input.addEventListener('keydown', () => {

    if(event.key !== "Enter")return;

        if(input.value === ""){

            nextBtn.classList.remove("hidden");
            prevBtn.classList.remove("hidden");
            input.placeholder = "Pesquisar...";

            if(contentController === 0){

                const movie = document.querySelectorAll('.movie');
                console.log(movie);

                for(i of movie){

                   i.remove();
                }

            }

            controller = 0;
            inicializar();
            
        }

    movieId = [];

    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`).then(function (respostaPesquisa){
            
        const titulo = document.querySelectorAll('.movie__title');
        const filme = document.querySelectorAll('.movie');
        const rating = document.querySelectorAll('.movie__rating');
        const estrela = document.querySelectorAll('span img');
        const promiseBodyPesquisa = respostaPesquisa.json();
        
        promiseBodyPesquisa.then(function (bodyPesquisa){
                    
            if(bodyPesquisa.results.length === 0){
                input.value = "";
                input.placeholder = "Filme não encontrado";
                return;
            }
                    
            for(let i = 0; i < titulo.length; i++){

                filme[i].classList.remove("hidden");

                if(!bodyPesquisa.results[i]){

                    filme[i].classList.add("hidden");
                        
                    continue;
                }

                movieId.push(bodyPesquisa.results[i].id);
                titulo[i].textContent = bodyPesquisa.results[i].original_title;
                        
                filme[i].style.backgroundImage = `url(${bodyPesquisa.results[i].poster_path})`;
                        
                rating[i].innerHTML = bodyPesquisa.results[i].vote_average;
                            
                estrela[i].innerHTML = "./assets/estrela.svg";
                rating[i].append(estrela[i]);
                   
                input.placeholder = "aperte 'enter' para voltar";
                input.value = "";
            }
            nextBtn.classList.add("hidden");
            prevBtn.classList.add("hidden");
               
        });
    });


});

// HIGHLIGHT
fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(function (resposta){

    const promiseBody = resposta.json();

    promiseBody.then(function (body){
      
        highlightMovie.style.backgroundImage = `url(${body.backdrop_path})`;
        highlightTitle.textContent = body.title;
        highlightRating.textContent = body.vote_average;

        for (let i of body.genres){

           highlightGenres.innerHTML += `${i.name}, `;

        }
        
    
        highlightLaunch.textContent = new Date(body.release_date).toLocaleString('pt-br', {year: 'numeric', month: 'long', day: 'numeric'});

        highlightDescription.textContent = body.overview;

 
    });

});

//VIDEO
 fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR`).then(function (resposta){

    const promiseResposta = resposta.json();

    promiseResposta.then(function (body){
  
        highlightVideo.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;

     });
});

//MUDAR TEMA
btnDarkOuLight.addEventListener('click', () =>{
    const root = document.querySelector('body');
    const highlight = document.querySelector('.highlight__info');
  

    if(btnDarkOuLight.src.includes("/assets/light-mode.svg")){

        btnDarkOuLight.src = "./assets/dark-mode.svg";
        root.style.setProperty('--color-white', '#242424');
        root.style.setProperty('--color-black', '#ffffff');
        root.style.setProperty('--shadow-black', 'rgba(255, 255, 255, 0.2)')
        nextBtn.src = "./assets/seta-direita-branca.svg";
        prevBtn.src = "./assets/seta-esquerda-branca.svg";
        highlight.style.background = "#454545";

    }else{

        btnDarkOuLight.src = "./assets/light-mode.svg";
        root.style.setProperty('--color-white', '#ffffff');
        root.style.setProperty('--shadow-black', 'rgba(0, 0, 0, 0.7)')
        root.style.setProperty('--color-black', '#000000');
        nextBtn.src = "./assets/seta-direita-preta.svg";
        prevBtn.src = "./assets/seta-esquerda-preta.svg";
        highlight.style.background = "#fff";
    }    
});

//PROXIMO
nextBtn.addEventListener('click', (event) => {
    
    controller +=5;
    movies.innerHTML = ""
    contentController = 1;

    if(controller === 20){

        controller = 0;
    }
 
    moviesView(controller);         
});

//ANTERIOR
prevBtn.addEventListener('click', (event) => {

    controller -= 5;
    movies.innerHTML = ""

    if(controller < 0){

        controller = 15;

    }

    contentController = 2;
    moviesView(controller);         

});

inicializar();