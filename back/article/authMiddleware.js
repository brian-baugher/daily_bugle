/**
 * This unsures users have the correct permission 
 * to use the article endpoints
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const authMiddleware = (req, res, next) => {
    console.log("Attempting to access route: " + req.path + " with method: " + req.method);
    const cookie = req.cookies.auth;
    console.log("Authenticating cookie: " + cookie);
    if(req.method == 'GET'){  //anyone can GET articles
        console.log("No auth needed, unprotected route\n")
        return next();
    }
    if(cookie === undefined) {
        console.log("No cookie included\n") 
        res.status(401).send({
            message: "No cookie included"
        })
        res.end();
        return;
    }
    fetch(`http://${req.hostname}:8080/dailyBugle/auth1/role`, {
        headers: {Cookie: `auth=${cookie}`}
    }).then(async result=> {
        const json = await result.json();
        console.log("Got result from Auth: " + JSON.stringify(json) + '\n');
        if(!json.isActive){
            res.status(401).send({
                message: "Invalid session cookie"
            });
            return;
        }
        if(req.path != '/comment' && !json.isAuthor){
            res.status(401).send({
                message: "Invalid permissions to perform this action"
            });
            return;
        }
        return next();
    }).catch(err => {
        console.log('Error fetching auth information: ' + err + '\n');
        res.status(500).send();
    })
}

export {authMiddleware}