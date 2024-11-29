import { getArticles, getCategories } from "./controllers/article.js";
import { getCookie } from "./utils.js";
import { renderAd, setupNavbar } from "./navbar.js";

const main  = document.getElementById('main');
const adBanner = document.getElementById('ad-banner');
const stories = document.getElementById('stories');
const pageSelect = document.getElementById('page-select');
const searchForm = document.getElementById('search');
const newArticle = document.getElementById('new-article');
const categories = document.getElementById('categories')
const newWrap = document.getElementById('new-wrap');

let active;
let _page = 0;
let showAds = true;
let userId;

const authCookie = getCookie('auth');
const authCookieObj = authCookie ? JSON.parse(decodeURIComponent(authCookie)) : null;
userId = authCookieObj?.userId;
if(authCookieObj?.role === 'author'){
    showAds = false; 
    newWrap.style.display = 'flex';
} else {
    newWrap.style.display = 'none';
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
function renderArticles({page, title, category}){
    return getArticles({page: page, title: title, category: category}).then(/**@param {import("./controllers/article.js").articlesResult} articlesResult*/ articlesResult => {
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
        body.innerHTML = primary.body.replaceAll(/(?:\r\n|\r|\n)/g, '<br>');
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

getCategories().then(cats => {
    const remove = document.createElement('div');
    remove.classList.add('remove', 'category');
    remove.onclick = (e) => {
        active?.classList.remove('active');
        active = null;
        renderArticles({});
    }

    const remove_p = document.createElement('p');
    remove_p.innerHTML = 'Clear Category Filter';
    remove.appendChild(remove_p);

    categories.appendChild(remove);
    cats.forEach(c => {
        const div = document.createElement('div');  //TODO: add onclick to this and state in file to highlight
        div.classList.add('category');
        div.onclick = (e) => {
            if(active){
                active.classList.remove('active');
            }
            div.classList.add('active');
            active = div;
            _page = 0;
            renderArticles({page: _page, category: c});
        }

        const p = document.createElement('p');
        p.innerHTML = c;
        div.appendChild(p);

        categories.appendChild(div);
    })
})
