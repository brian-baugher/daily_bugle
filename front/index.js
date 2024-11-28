import { getArticles, getCategories } from "./controllers/article.js";
import { getCookie } from "./utils.js";
import { renderAd, setupNavbar } from "./navbar.js";

const main  = document.getElementById('main');
const adBanner = document.getElementById('ad-banner');
const stories = document.getElementById('stories');
const pageSelect = document.getElementById('page-select');
const searchForm = document.getElementById('search');
const newArticle = document.getElementById('new-article');

let _page = 0;
let showAds = true;
let userId;

const authCookie = getCookie('auth');
const authCookieObj = authCookie ? JSON.parse(decodeURIComponent(authCookie)) : null;
userId = authCookieObj?.userId;
if(authCookieObj?.role === 'author'){
    showAds = false; 
    newArticle.hidden = false;
}

newArticle.onclick = () => {
    window.location.href = '/edit.html'
}

pageSelect.onchange = e => {
    _page = pageSelect.value;
    renderArticles({page: pageSelect.value});
}

searchForm.onsubmit = e => {
    e.preventDefault();
    _page = 0;
    const formData = new FormData(e.target);
    renderArticles({page: _page, title: formData.get('title')});
}

setupNavbar(authCookieObj);

renderArticles({page: _page}).then(() => { // initial render, have to do this thening because the ad impression requires everything to load
    if(!showAds){
        adBanner.remove();
        return;
    }
    renderAd(userId, main.getAttribute('data-id'), adBanner);
}); 

/**
 * use this to re-render articles when the page changes, just call on click
 */
function renderArticles({page, title}){
    return getArticles({page: page, title: title}).then(/**@param {import("./controllers/article.js").articlesResult} articlesResult*/ articlesResult => {
        console.log(articlesResult);
        if(articlesResult.total === 0){
            main.replaceChildren();

            const title = document.createElement('h2');
            title.id = 'main-title';
            title.innerHTML = "Oops no articles found";
            title.classList.add('title');
            main.appendChild(title);

            stories.replaceChildren();
            pageSelect.replaceChildren();
            return;
        } 
        pageSelect.replaceChildren();
        for(let i = 1; i <= Math.ceil(articlesResult.total / 10); i++){
            const opt = document.createElement('option');
            opt.value = i - 1;
            opt.innerHTML = i;
            pageSelect.appendChild(opt);
        }
        pageSelect.value = page;
        articlesResult.result.reverse();
        const primary = articlesResult.result.pop(); 

        main.replaceChildren();

        const title = document.createElement('h2');
        title.id = 'main-title';
        title.innerHTML = primary.title;
        title.classList.add('title');
        title.onclick = () => {
            localStorage.setItem('article', JSON.stringify(primary));
            window.location.href = `/article.html?id=${primary._id}`;
        }
        main.appendChild(title);

        const body = document.createElement('p');
        body.id = 'main-body';
        body.innerHTML = primary.body;
        main.appendChild(body);
        main.setAttribute('data-id', primary._id)

        stories.replaceChildren();
        articlesResult.result.forEach(a => {
            const div = document.createElement('div');
            div.classList.add('story');
            const h = document.createElement('h3');
            h.innerHTML = a.title;
            h.classList.add('title');
            h.onclick = () => {
                localStorage.setItem('article', JSON.stringify(a));
                window.location.href = `/article.html?id=${a._id}`;
            }
            const p = document.createElement('p');
            p.innerHTML = a.teaser;
            div.appendChild(h);
            div.appendChild(p);
            stories.appendChild(div);
        })
    });
}

getCategories().then(r => console.log(r))
