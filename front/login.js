import {getAdToDisplay, recordAdImpression} from './controllers/ad.js';
import { createUser, submitLogin } from './controllers/auth.js';
getAdToDisplay().then(res => {
    console.log(res);
});

const loginForm = document.getElementById('login-form');
const errorBar = document.getElementById('error-line');
loginForm.onsubmit = /**@param {SubmitEvent} e */ async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = formData.get('username');
    const pass = formData.get('password');
    const role = await submitLogin(user, pass);
    if(!role){
        errorBar.style.color = 'red';
        errorBar.innerHTML = "Invalid username or password";
        return;
    }
    else if(role == 'reader'){
        window.location.replace('http://127.0.0.1:3010/reader.html');
    }
    else if(role == 'author'){
        window.location.replace('http://127.0.0.1:3010/author.html');
    }
}

const newUser = document.getElementById('new-user');
const newModal = document.getElementById('new-modal');
const content = document.getElementById('content');
newUser.onclick = () => {
    content.style.display = 'none';    
    newModal.style.display = 'block';
}

const newForm = document.getElementById('new-form');
const newErr = document.getElementById('new-error')
newForm.onsubmit = /**@param {SubmitEvent} e */ async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = formData.get('username');
    const password = formData.get('password');
    const confirm = formData.get('confirmPassword');
    if(confirm != password){
        newErr.innerHTML = 'Passwords do not match';
        return;
    }
    const err = await createUser(user, password);
    if(err){
        newErr.innerHTML = err;
    } else{
        errorBar.innerHTML = "New user created, please log in";
        errorBar.style.color = 'green';
        newModal.style.display = 'none';
        content.style.display = 'block';
    }
}