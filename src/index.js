import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import './css/styles.css';
import getRefs from './get-refs';
import FetchApiServise from './api-servises';
// import { galleryTemplate } from './templates';
// import galleryTpl from './templates/gallery.hbs';

// import { template } from './templates/gallery-tpl';

// console.log(template({ name: 'Nils' }));

const fetchApiServise = new FetchApiServise();
const refs = getRefs();


refs.form.addEventListener('submit', onSubmitSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick)

btnIsHidden();
 

async function onSubmitSearch(e) {
    e.preventDefault();

    clearContainer();
    fetchApiServise.query = e.currentTarget.elements.searchQuery.value.trim();
    if (fetchApiServise.query === '') {
        return Notiflix.Notify.failure('You should enter a valid request');
    }

    fetchApiServise.resetPage();

    // const ({ hits, totalHits })


    // let timerId = setTimeout(btnIsActive, 2000); 
    try {
        const { hits, totalHits } = await fetchApiServise.fetchSearch();
//   let timerId = setTimeout(btnIsActive, 2000); 
        const checkedArr = checkingEmptyArr(hits);
        const messTotalHits = messageWithTotalHits(totalHits);
        const renderedGallery = renderGallery(hits);
        const checkedPageAmount = checkingAmountOfPages(totalHits);
        // const simpleLightBox = activateSimpleLightBox();

        const allWorks = await Promise.all([checkedArr, messTotalHits, renderedGallery, checkedPageAmount]);
        
    } catch (error) {
        console.log(error.message);
    };
    activateSimpleLightBox();

    // fetchApiServise.fetchSearch()
    //     .then(({ hits, totalHits }) => {
    //         // let timerId = setTimeout(btnIsActive, 1000);
            // checkingEmptyArr(hits, timerId);
            // messageWithTotalHits(totalHits);
            // renderGAlary(hits);
            // checkingAmountOfPages(totalHits);

    
    //     })
    //     .then(activateSimpleLightBox);
        
    // let timerId = setTimeout(btnIsActive, 1000);  
};


async function onLoadMoreBtnClick() {
    
     try {
        const { hits, totalHits } = await fetchApiServise.fetchSearch();

        const renderedGallery = renderGallery(hits);
        const checkedPageAmount = checkingAmountOfPages(totalHits);
        //  const simpleLightBox = activateSimpleLightBox();
         const smoothScr = smoothScroll();

        const allWorks = await Promise.all([renderedGallery, checkedPageAmount, smoothScr]);
        
    } catch (error) {
        console.log(error.message);
    };
    
    activateSimpleLightBox();
        // fetchApiServise.fetchSearch()
        //     .then(({ totalHits, hits }) => {
        //         renderGAlary(hits);
        //         checkingAmountOfPages(totalHits);
        //     })
        //     .then(activateSimpleLightBox)
        //  .then(smoothScroll);   
    
};
    

const renderGallery = gallery => {
    const markUp = gallery.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
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



const clearContainer = () => {
refs.gallery.innerHTML = '';
}

function activateSimpleLightBox () {
    const gallery = new SimpleLightbox('.gallery a');
    gallery.refresh();

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
    if (totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} totalHits images.`)
    }
    
}


function endOfSearchResult() {
    
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
}

// checking
function checkingAmountOfPages(totalHits, timerId) {
       
                let totalPages = Math.ceil(totalHits / fetchApiServise.per_page);
                let currentPage = fetchApiServise.page-1;
                console.log(totalPages, currentPage);
                // let timerId = setTimeout(btnIsActive, 1000);
        if (totalPages === currentPage) {
                    console.log('got total')
                    endOfSearchResult();
            clearTimeout(timerId);
                    btnIsHidden();
                    
        } else if (totalPages > currentPage) {
                          let timerId = setTimeout(btnIsActive, 1000);

        }
          
            
}

function checkingEmptyArr(hits, timerId) {
    if (hits.length === 0) {
        clearTimeout(timerId);
        btnIsHidden();
        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    };
};