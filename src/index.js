import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import './css/styles.css';
import getRefs from './get-refs';
import FetchApiServise from './api-servises';

const fetchApiServise = new FetchApiServise();
const refs = getRefs();


refs.form.addEventListener('submit', onSubmitSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick)

btnIsHidden();

function onSubmitSearch(e) {
    e.preventDefault();

    clearContainer();
    fetchApiServise.query = e.currentTarget.elements.searchQuery.value.trim();
    if (fetchApiServise.query === '') {
        return Notiflix.Notify.failure('You should enter a valid request');
    }

    fetchApiServise.resetPage();
    fetchApiServise.fetchSearch()
        .then(({ hits, totalHits }) => {
            // let timerId = setTimeout(btnIsActive, 1000);
            checkingEmptyArr(hits, timerId);
            messageWithTotalHits(totalHits);
            renderGAlary(hits);
            checkingAmountOfPages(totalHits);

        })
        .then(activateSimpleLightBox);
        
    let timerId = setTimeout(btnIsActive, 1000);  
};


function onLoadMoreBtnClick() {
    
        fetchApiServise.fetchSearch()
            .then(({ totalHits, hits }) => {
                renderGAlary(hits);
                checkingAmountOfPages(totalHits);
            })
            .then(activateSimpleLightBox)
            .then(smoothScroll);        
};
    

const renderGAlary = galary => {
    const markUp = galary.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
            <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" title="" loading="lazy" width="360" height="260"/>
            </a>
            <div class="info">
                <p class="info-item">
                <b>Likes</b><br>
                ${likes}
                </p>
                <p class="info-item">
                <b>Views</b><br>
                ${views}
                </p>
                <p class="info-item">
                <b>Comments</b><br>
                ${comments}
                </p>
                <p class="info-item">
                <b>Downloads</b><br>
                ${downloads}
                </p>
            </div>
        </div>`
    ).join('');
    // console.log(markUp);

    refs.gallery.insertAdjacentHTML('beforeend', markUp);

}

const activateSimpleLightBox = () => {
    const galery = new SimpleLightbox('.gallery a');
}

const clearContainer = () => {
refs.gallery.innerHTML = '';
}

function smoothScroll() {
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
};

// button
function btnIsHidden() {
    refs.loadMoreBtn.classList.add('is-hidden');
};

function btnIsActive() {
    refs.loadMoreBtn.classList.remove('is-hidden');
}

// messages
function messageWithTotalHits(totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} totalHits images.`)
}


function endOfSearchResult() {
    
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
}

// checking
function checkingAmountOfPages(totalHits, timerId) {
       {
                let totalPages = Math.ceil(totalHits / fetchApiServise.per_page);
                let currentPage = fetchApiServise.page-1;
                console.log(totalPages, currentPage);
                // let timerId = setTimeout(btnIsActive, 1000);
                if (totalPages === currentPage) {
                    endOfSearchResult();
                    clearTimeout(timerId)
                    btnIsHidden();
                    
                } 
                
            }
}

function checkingEmptyArr(hits, timerId) {
    if (hits.length === 0) {
        clearTimeout(timerId);
        btnIsHidden();
        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    };
};