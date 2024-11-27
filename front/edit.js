import { setupNavbar } from "./navbar.js";
import { getCookie } from "./utils.js";

const authCookie = getCookie('auth');
const authCookieObj = authCookie ? JSON.parse(decodeURIComponent(authCookie)) : null;
const urlParams = new URLSearchParams(window.location.search);
const addCategory = document.getElementById('add-category')
const categories = document.getElementById('categories');
const category = document.getElementById('category');
const editForm = document.getElementById('edit')

const isArticleUpdate = () => {
    return urlParams.has('id');
}

editForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData);
    const categoryArr = []
    categories.childNodes.forEach(cat => {
        categoryArr.push(cat.getAttribute('data-category'))
    })
    console.log(categoryArr);
    if(isArticleUpdate()){
        //PUT
    }else {
        //POST
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
    //window.location.replace('http://localhost/');
}

setupNavbar(authCookieObj);