import routes from "./routes.js";

const submitLogin = async (username, password) => {
    try{
        const res = await fetch(routes.login, {
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        console.log(res);
        if(res.status === 200) {
            const j = await res.json();
            console.log(j);
            return j.role;
        } else{
            return ''; // not authorized
        }
    } catch(err){
        console.log(err);
        return '';
    }
}

export {submitLogin};