export default function getRefs() {
    return {
        form: document.getElementById('search-form'),
        input: document.querySelector('.search-form', 'input'),
        gallery: document.querySelector('.gallery'),
        loadMoreBtn: document.querySelector('.load-more'),
    }
    
    
}