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
    fetchApiServise.query = e.currentTarget.elements.searchQuery.value;
    if (fetchApiServise.query === '') {
        return Notiflix.Notify.failure('You should enter a valid request');
    }

    fetchApiServise.resetPage();
    fetchApiServise.fetchSearch()
        .then(({hits, totalHits}) => {
            if (hits.length === 0) {
                clearTimeout(timerId)
                return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            }
            let totalPages = Math.ceil(totalHits / fetchApiServise.per_page);
                let currentPage = fetchApiServise.page-1;
                console.log(totalPages, currentPage);
            if (totalPages === currentPage) {
                endOfSearchResoult();
                btnIsHidden();
            } else {
                
                renderGAlary(hits); 
            }
            
        })
        .then(activateSimpleLightBox)
        
    let timerId = setTimeout(btnIsActive, 1000);
    
    
}


function onLoadMoreBtnClick() {
    
        fetchApiServise.fetchSearch()
            .then(({totalHits, hits}) => {
                let totalPages = Math.ceil(totalHits / fetchApiServise.per_page);
                let currentPage = fetchApiServise.page-1;
                console.log(totalPages, currentPage);

                renderGAlary(hits);
                let timerId = setTimeout(btnIsActive, 1000);
                if (totalPages === currentPage) {
                    endOfSearchResult();
                    clearTimeout(timerId)
                    btnIsHidden();
                    
                } 
                
            })
            .then(activateSimpleLightBox);
    
            
} 
    

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



// button
function btnIsHidden() {
    refs.loadMoreBtn.classList.add('is-hidden');
};

function btnIsActive() {
    refs.loadMoreBtn.classList.remove('is-hidden');
}

function endOfSearchResult() {
    
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
}