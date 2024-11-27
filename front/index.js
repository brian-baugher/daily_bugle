import { getAdToDisplay, recordAdImpression } from "./controllers/ad.js";
import { getArticles } from "./controllers/article.js";

const login = document.getElementById('login');
const main  = document.getElementById('main');
const adBanner = document.getElementById('ad-banner');
const stories = document.getElementById('stories');
const pageSelect = document.getElementById('page-select');
const searchForm = document.getElementById('search');
const username = document.getElementById('username');
const logout = document.getElementById('logout');
let _page = 0;
let showAds = true;
let userId;

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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';')?.shift();
}

const authCookie = getCookie('auth')
if(authCookie){
    const cookieObj = JSON.parse(decodeURIComponent(document.cookie.substring(5)))
    login.hidden = true;
    logout.hidden = false;
    username.hidden = false;
    username.innerHTML = cookieObj.user; // use cookieObj.role to get role
    if(cookieObj.role === 'author'){
        showAds = false; 
    }
    userId = cookieObj.userId;
}

logout.onclick = () => {
    document.cookie = 'auth=; Max-Age=0; path=/';   //remove auth cookie
    window.location.reload();
}

login.onclick = () => {
    window.location.replace('http://localhost:3010/dailyBugle/auth1');
}

renderArticles({page: _page}).then(() => {
    renderAd().then(() => {
        adBanner.onclick = () => {
            recordAdImpression({
                adId: adBanner.getAttribute('data-id'),
                userId: userId,
                articeId: main.getAttribute('data-id'),
                eventType: 'click'
            })
        }
    });
}); // initial render, have to do this thening because the ad impression requires everything to load

/**
 * use this to re-render articles when the page changes, just call on click
 */
function renderArticles({page, title}){
    return getArticles({page: page, title: title}).then(/**@param {import("./controllers/article.js").articlesResult} articlesResult*/ articlesResult => {
        console.log(articlesResult);
        if(articlesResult.total === 0){
            main.innerHTML = "Oops no articles found";  // TODO: change?
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
            const p = document.createElement('p');
            p.innerHTML = a.teaser;
            div.appendChild(h);
            div.appendChild(p);
            stories.appendChild(div);
        })
    });
}

function renderAd(){
    return getAdToDisplay().then(/**@param {import("./controllers/ad.js").ad} ad*/ ad => {
        if(!showAds){
            adBanner.remove();
            return;
        }
        const p = document.createElement('p');
        p.classList.add('scroll');
        p.id = 'ad-text';
        p.innerHTML = ad?.advertisement; // TODO: handle no ad? 
        adBanner.appendChild(p);
        adBanner.setAttribute('data-id', ad?._id);
        recordAdImpression({
            adId: ad._id, 
            userId: userId, 
            articeId: main.getAttribute('data-id'), 
            eventType: 'view'});
    });
}
