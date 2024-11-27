import { getArticles } from "./controllers/article.js";
import { getCookie } from "./utils.js";

const title = document.getElementById('title');
const categories = document.getElementById('categories');
const created = document.getElementById('created');
const body = document.getElementById('body');
const comments = document.getElementById('comments');
const urlParams = new URLSearchParams(window.location.search);

let role;
let userId;
const authCookie = getCookie('auth');
if(authCookie){
    const cookieObj = JSON.parse(decodeURIComponent(authCookie))
    userId = cookieObj.userId;
    role = cookieObj.role;
    console.log(role, userId);
}

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
    created.innerHTML = article.dateCreated;
    body.innerHTML = article.body;
    article.categories.forEach(cat => {
        const h3 = document.createElement('h3');
        h3.innerHTML = cat;
        categories.appendChild(h3);
    })
    article.comments.forEach(com => {
        const div = document.createElement('div');

        const dateCreated = document.createElement('h4');
        dateCreated.innerHTML = com.dateCreated;
        div.appendChild(dateCreated);

        const comment = document.createElement('p');
        comment.innerHTML = com.comment;
        div.appendChild(comment);

        comments.append(div);
    })
}

loadArticle().then(() => {
    displayArticle();
});