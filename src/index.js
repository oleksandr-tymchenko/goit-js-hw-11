import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css';
import getRefs from './get-refs';

import { fetchData } from './api-servises';
const axios = require('axios').default;

const refs = getRefs();

const API_KEY = '34527862-993120beb94eb9a2ced5c8bcb';
const BASE_URL = 'https://pixabay.com/api/';

const queryParams = {
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: 40,
    safesearch: true,
    page: 1
}

let query = '';

// refs.input.addEventListener('input', onInputValue);

refs.form.addEventListener('submit', onSubmitSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick)


function onSubmitSearch(e) {
    e.preventDefault();
    
    resetSearch();
    query = e.currentTarget.elements.searchQuery.value;
    
    fetchSearch(query);
   
}

function onLoadMoreBtnClick() {

    queryParams.page += 1;
    fetchSearch(query);
    console.log(queryParams.page)
}

const fetchSearch = query => {
    queryParams.q = query;
    console.log(queryParams);
    axios.get(BASE_URL, {
    params: {
        ...queryParams,
        key: API_KEY,
    },
})
        .then(response => { renderGAlary(response.data.hits) })
        .then(activateSimpleLightBox)
    .catch(error => {console.log(error)})
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
    console.log(markUp);

    refs.gallery.insertAdjacentHTML('beforeend', markUp);

}

const activateSimpleLightBox = () => {
    const galery = new SimpleLightbox('.gallery a');
}

const resetSearch = () => {
refs.gallery.innerHTML = '';
    queryParams.page = 1;
}