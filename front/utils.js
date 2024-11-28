import { getArticles } from "./controllers/article.js";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';')?.shift();
}

const loadArticle = (urlParams) => {
    if(!localStorage.getItem('article') ||
        JSON.parse(localStorage.getItem('article'))._id != urlParams.get('id')
    ){   // if navigated to url directly
        console.log('localStorage empty or old, fetching article with id: ' + urlParams.get('id'))
        return getArticles({id: urlParams.get('id')}).then(/**@param {import("./controllers/article.js").articlesResult} res */res => {
            if(res.total === 0){
                console.log('not found');
                window.location.href = '/404.html';
            }
            localStorage.setItem('article', JSON.stringify(res.result[0]));
        })
    }
    return new Promise((res, rej) => res()) // we already have it, resolve
}

export {getCookie, loadArticle}