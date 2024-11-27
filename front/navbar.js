import { getAdToDisplay, recordAdImpression } from "./controllers/ad.js";

const logo = document.getElementById('logo');
const username = document.getElementById('username');
const logout = document.getElementById('logout');
const login = document.getElementById('login');

/**
 * use this to render an ad in the designated adBanner with tracking, 
 * determing if it should be shown based on role is up to caller
 * @param {string} userId hex user id
 * @param {string} articleId hex article id
 * @param {HTMLDivElement} adBanner place to display ad
 * @returns thenable object
 */
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

/**
 * call this when using the (copy and pasted) Navbar to set up it's functionality
 * make sure to import navbar.css
 * @param {Object} authCookieObj parsed auth cookie
 */
function setupNavbar(authCookieObj){
    logo.onclick = () => window.location.href = '/'

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