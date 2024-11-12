import {getAdToDisplay, recordAdImpression} from './controllers/ad.js';
import { submitLogin } from './controllers/auth.js';
getAdToDisplay().then(res => {
    console.log(res);
});

const loginForm = document.getElementById('login-form');
loginForm.onsubmit = /**@param {SubmitEvent} e */ async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = formData.get('username');
    const pass = formData.get('password');
    const role = await submitLogin(user, pass);
    console.log(role);
}
