import { submitComment } from "./controllers/article.js";
import { renderAd, setupNavbar } from "./navbar.js";
import { getCookie, loadArticle } from "./utils.js";

const title = document.getElementById('title');
const categories = document.getElementById('categories');
const created = document.getElementById('created');
const body = document.getElementById('body');
const comments = document.getElementById('comments');
const adBanner = document.getElementById('ad-banner');
const edit = document.getElementById('edit');
const addComment = document.getElementById('add-comment');
const commentForm = document.getElementById('comment-form');
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

edit.onclick = () => {
    document.location.href = `edit.html?id=${urlParams.get('id')}`
}

commentForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const commentText = formData.get('comment-text');
    submitComment(commentText, urlParams.get('id')).then((res) => {
        localStorage.clear();
        window.location.reload();
    })
}

setupNavbar(authCookieObj);

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
    article.comments.reverse().forEach(com => {
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

loadArticle(urlParams).then(() => {
    displayArticle();
    if(!showAds){
        adBanner.remove();
        return;
    }
    renderAd(userId, urlParams.get('id'), adBanner);
});