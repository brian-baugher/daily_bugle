import { getAdToDisplay, recordAdImpression } from "./controllers/ad.js";

const username = document.getElementById('username');
const logout = document.getElementById('logout');
const login = document.getElementById('login');

function renderAd(userId, articleId, adBanner){
    return getAdToDisplay().then(/**@param {import("./controllers/ad.js").ad} ad*/ ad => {
        const p = document.createElement('p');
        p.classList.add('scroll');
        p.id = 'ad-text';
        p.innerHTML = ad?.advertisement; // TODO: handle no ad? 
        adBanner.appendChild(p);
        adBanner.setAttribute('data-id', ad?._id);
        recordAdImpression({
            adId: ad._id, 
            userId: userId, 
            articeId: articleId, 
            eventType: 'view'});
        adBanner.onclick = () => {
            recordAdImpression({
                adId: adBanner.getAttribute('data-id'),
                userId: userId,
                articeId: articleId,
                eventType: 'click'
            })
        }
    });
}

function setupNavbar(authCookieObj){
    logout.onclick = () => {
        document.cookie = 'auth=; Max-Age=0; path=/';   //remove auth cookie
        window.location.reload();
    }

    login.onclick = () => {
        window.location.replace('http://localhost:3010/dailyBugle/auth1');
    }

    if(authCookieObj){ 
        login.hidden = true;
        logout.hidden = false;
        username.hidden = false;
        username.innerHTML = authCookieObj.user;
    }
}

export {renderAd, setupNavbar}