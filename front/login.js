import {getAdToDisplay, recordAdImpression} from './controllers/ad.js';
import { submitLogin } from './controllers/auth.js';
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
