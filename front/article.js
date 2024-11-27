import { getArticles } from "./controllers/article.js";
import { renderAd, setupNavbar } from "./navbar.js";
import { getCookie } from "./utils.js";

const title = document.getElementById('title');
const categories = document.getElementById('categories');
const created = document.getElementById('created');
const body = document.getElementById('body');
const comments = document.getElementById('comments');
const adBanner = document.getElementById('ad-banner');
const editBox = document.getElementById('edit-box');
const edit = document.getElementById('edit');
const editForm = document.getElementById('edit-form');
const addComment = document.getElementById('add-comment');
const urlParams = new URLSearchParams(window.location.search);

let role;
let userId;
let showAds = true;

const authCookie = getCookie('auth');
const authCookieObj = authCookie ? JSON.parse(decodeURIComponent(authCookie)) : null;
userId = authCookieObj?.userId;
role = authCookieObj?.role;
if(role === 'author'){
    showAds = false; 
    edit.hidden = false;
} else if(role === 'reader'){
    addComment.hidden = false;
}

setupNavbar(authCookieObj);

const loadArticle = () => {
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

const displayArticle = () => {
    /**@type {import("./controllers/article.js").article} */
    const article = JSON.parse(localStorage.getItem('article'));
    title.innerHTML = article.title;
    const dateCreatedObj = new Date(article.dateCreated);
    created.innerHTML = `Posted: ${dateCreatedObj.toLocaleDateString()}`;
    body.innerHTML = article.body;
    article.categories.forEach(cat => {
        const h3 = document.createElement('h3');
        h3.innerHTML = cat;
        categories.appendChild(h3);
    })
    article.comments.forEach(com => {
        const div = document.createElement('div');
        div.classList.add('comment');

        const dateCreated = document.createElement('h4');
        const comDateObj = new Date(com.dateCreated);
        dateCreated.innerHTML = `Commented: ${comDateObj.toLocaleDateString()}`;
        div.appendChild(dateCreated);

        const comment = document.createElement('p');
        comment.innerHTML = com.comment;
        div.appendChild(comment);

        comments.append(div);
    })
}

loadArticle().then(() => {
    displayArticle();
    if(!showAds){
        adBanner.remove();
        return;
    }
    renderAd(userId, urlParams.get('id'), adBanner);
});