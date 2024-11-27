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
    console.log(articles);
    if(articles.length === 0){
        main.innerHTML = "Oops no articles found";  // TODO: change?
        return;
    } 
    const primary = articles.pop(); 

    const title = document.createElement('h2');
    title.id = 'main-title';
    title.innerHTML = primary.title;
    main.appendChild(title);

    const body = document.createElement('p');
    body.id = 'main-body';
    body.innerHTML = primary.body;
    main.appendChild(body);

    stories.replaceChildren();
    articles.forEach(a => {
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

getAdToDisplay().then(/**@param {import("./controllers/ad.js").ad} ad*/ ad => {
    const p = document.createElement('p');
    p.classList.add('scroll');
    p.id = 'ad-text';
    p.innerHTML = ad?.advertisement; // TODO: and handle no ad
    adBanner.appendChild(p);
    adBanner.setAttribute('data-id', ad?._id);
});