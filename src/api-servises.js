const axios = require('axios').default;


// const BASE_URL = '';

export const fetchData = data => {
    const url = ``;
    return fetch(url)
        .then(res => res.json())
        // .then(console.log);
};

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

