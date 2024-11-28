import { createArticle, updateArticle } from "./controllers/article.js";
import { setupNavbar } from "./navbar.js";
import { getCookie, loadArticle } from "./utils.js";

const authCookie = getCookie('auth');
const authCookieObj = authCookie ? JSON.parse(decodeURIComponent(authCookie)) : null;
const urlParams = new URLSearchParams(window.location.search);
const addCategory = document.getElementById('add-category')
const categories = document.getElementById('categories');
const category = document.getElementById('category');
const editForm = document.getElementById('edit')
const title = document.getElementById('title');
const teaser = document.getElementById('teaser');
const body = document.getElementById('body');


const isArticleUpdate = () => {
    return urlParams.has('id');
}

editForm.onsubmit = (e) => {
    e.preventDefault();
    localStorage.clear();
    const formData = new FormData(e.target);
    console.log(formData);
    const title = formData.get('title');
    const teaser = formData.get('teaser');
    const body = formData.get('body');
    const categoryArr = []
    categories.childNodes.forEach(cat => {
        categoryArr.push(cat.getAttribute('data-category'))
    })
    console.log(categoryArr);
    if(isArticleUpdate()){
        updateArticle(urlParams.get('id'), title, teaser, body, categoryArr).then(res => {
            console.log(res);
            if(!res?.acknowledged){
                alert('error uploading article')
            }
            window.location.href = `/article.html?id=${urlParams.get('id')}`;
        });
    }else {
        createArticle(title, teaser, body, categoryArr).then((res) => {
            console.log(res)
            if(!res?.acknowledged){
                alert('error uploading article')
            }
            window.location.href = `/article.html?id=${res.insertedId}`
        })
    }
}

addCategory.onclick = () => {
    const li = document.createElement('li');
    const p = document.createElement('p');
    const x = document.createElement('button');
    p.innerHTML = category.value;
    x.innerHTML = 'X'
    x.onclick = () => {
        categories.removeChild(li);
    }
    li.appendChild(p);
    li.appendChild(x);
    li.setAttribute('data-category', category.value);
    categories.appendChild(li);
    category.value = ""
}

const userId = authCookieObj?.userId;
if(authCookieObj?.role != 'author'){    // have to be author to be here
    console.log('no')
    window.location.replace('http://localhost/'); // TODO: uncomment
}

const populateText = () => {
    if(!isArticleUpdate()){
        return;
    }
    loadArticle(urlParams).then(() => {
        const article = JSON.parse(localStorage.getItem('article'));
        title.value = article.title;
        teaser.value = article.teaser;
        body.value = article.body;
        article.categories?.forEach(cat => {
            const li = document.createElement('li');
            const p = document.createElement('p');
            const x = document.createElement('button');
            p.innerHTML = cat;
            x.innerHTML = 'X';
            x.onclick = () => {
                categories.removeChild(li);
            }
            li.appendChild(p);
            li.appendChild(x);
            li.setAttribute('data-category', cat);
            categories.appendChild(li);
        })
    })
}

populateText();

setupNavbar(authCookieObj);