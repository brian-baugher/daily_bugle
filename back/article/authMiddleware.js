/**
 * This unsures users have the correct permission 
 * to use the article endpoints
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const authMiddleware = (req, res, next) => {
    console.log(JSON.stringify(req.cookies))
    const cookie = req.cookies.auth;
    console.log(cookie);
    if(req.method == 'GET'){  //anyone can GET articles
        return next();
    }
    if(cookie === undefined) { 
        res.status(401).send({
            message: "No cookie included"
        })
        res.end();
        return;
    }
    //TODO: call auth service
}

export {authMiddleware}