import { getAdToDisplay } from "./controllers/ad.js";
import { getArticles } from "./controllers/article.js";

const login = document.getElementById('login');
const main  = document.getElementById('main');
const adBanner = document.getElementById('ad-banner');
const stories = document.getElementById('stories');
let page = 0;

login.onclick = () => {
    window.location.replace('http://localhost:3010/dailyBugle/auth1');
}

getArticles({page: page}).then(/**@param {Array<import("./controllers/article.js").article>} articles*/ articles => {
    if(articles.length === 0){
        main.innerHTML = "Oops no articles found";  // TODO: change
        return;
    } 
    const primary = articles.pop();
    main.innerHTML = primary.title; // TODO: change
    stories.replaceChildren();
    articles.forEach(a => {
        const div = document.createElement('div');  //TODO style better
        const h = document.createElement('h3');
        h.innerHTML = a.title;
        const p = document.createElement('p');
        p.innerHTML = a.teaser;
        div.appendChild(h);
        div.appendChild(p);
        stories.appendChild(div);
    })
});

getAdToDisplay().then(/**@param {import("./controllers/ad.js").ad} ad*/ ad => {
    adBanner.innerHTML = ad?.advertisement; // TODO: ad impression and handle no ad
    adBanner.setAttribute('data-id', ad?._id);
    console.log("hdo")
});