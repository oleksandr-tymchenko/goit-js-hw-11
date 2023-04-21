const axios = require('axios').default;
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const API_KEY = '34527862-993120beb94eb9a2ced5c8bcb';
const BASE_URL = 'https://pixabay.com/api/';
const queryParams = {
                q: '',
                image_type: 'photo',
                orientation: 'horizontal',
                per_page: 40,
                safesearch: true,
                page: null,
        };


export default class FetchApiServise {
    constructor() { 
        this.searchQuery = '';
        this.page = 0;
        this.per_page = queryParams.per_page;
    }


    async fetchSearch() {
        queryParams.page = this.page;
        queryParams.q = this.searchQuery;

        const response = await axios.get(BASE_URL, {
            params: {
                ...queryParams,
                key: API_KEY,
            },
        });
        
        this.incrementPage();
       
        const data = await response.data;
        return data;
        
        // return axios.get(BASE_URL, {
        //     params: {
        //         ...queryParams,
        //         key: API_KEY,
        //     },
        //     })
        //     .then(response => {
        //     //          if (!response.ok) {
        //     //     throw new Error(response.status);
        //     // }
        //             this.incrementPage();
        //             console.log(response.data)
        //             return response.data;
        //         })
                // .catch(error => {console.log(error)})
    };
    

    incrementPage() {
        this.page += 1;
    }

    resetPage () {
    this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }


}






















// const BASE_URL = '';

// export const fetchData = data => {
//     const url = ``;
//     return fetch(url)
//         .then(res => res.json())
//         // .then(console.log);
// };

// export const fetchCountries = name => {
//     const url = `${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`;
//     return fetch(url)
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(response.status);
//             }
//             return response.json();
//         });
// };

