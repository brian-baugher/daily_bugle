import express, { json } from 'express';
import { MongoClient, Timestamp, ObjectId } from 'mongodb';
import cookieParser from 'cookie-parser';

const mongoURI = 'mongodb://host.docker.internal:27017'
const client = new MongoClient(mongoURI);
async function connect() {
    await client.connect();
}
connect();

const hostname = '0.0.0.0';
const port = 3013;

const app = express();
app.use(json());
app.use(cookieParser());
app.listen(port, hostname, () => {console.log(`listening at http://${hostname}:${port}`)});
app.set('trust proxy', true);

let sessions = new Map();

app.post('/new', async (req, res) => {
    const {username, password} = req.body;
    console.log('/new POST recvd, making user with username: ' + username + ' password: ' + password + '\n');
    
    const user = {
            username: username,
            password: password,
            role: 'reader'
        }
    // maybe check if valid here, like no existing user?
    await client.db('daily_bugle').collection('user')
        .insertOne(user)
        .then(result => {
            console.log('inserted new user ' + JSON.stringify(user) + '\nresults: ' + JSON.stringify(user) + '\n');
            res.send(result);
        })
        .catch(err => {
            console.log('Error inserting ' + JSON.stringify(user) + '\ncode: ' + err + '\n');
            res.status(400).send({
                message: err
            });
        });
});

app.post('/', async (req, res) => {
    const {username, password} = req.body;
    console.log('POST recvd, logging in user with username: ' + username + ' password: ' + password + '\n');
    
    const user = {
            username: username,
            password: password,
        }
    await client.db('daily_bugle').collection('user')
        .findOne(user)
        .then(result => {
            if(result === null){
                console.log('No user found with username: ' + username + ' and password: ' + password + '\n');
                res.status(401).send({
                    message: 'No user found with that username and password'
                });
                return;
            }
            const cookie = {
                user: username,
                userId: result._id,
                key: sessions.size,
                userAgent: req.headers['user-agent'],
                ip: req.ip,
                role: result.role,
                expires: Date.now() + 86400000, // now plus 1 day
            }
            sessions.set(sessions.size, cookie);
            console.log('User found, logging in and setting cookie: ' + JSON.stringify(cookie) + '\n');
            res.cookie('auth', cookie, {
                httpOnly: true,
            })
            res.status(200).send();
        })
        .catch(err => {
            console.log('Error finding ' + JSON.stringify(user) + '\ncode: ' + err + '\n');
            res.status(500).send({
                message: 'Internal server error, please try again'
            });
        });
});

const isValidSession = (sessionCookie, sessionKey) => {
    console.log("Checking validity of cookie: " + JSON.stringify(sessionCookie) + '\n');
    if(!sessions.has(sessionKey)) { 
        console.log("Key not found")
        return false; 
    }
    const storedSession = sessions.get(sessionKey);

    for( const k in storedSession){
        if(storedSession[k] != sessionCookie[k]) {
            console.log("Value for key : " + k + " does not match");
            console.log("Expected: " + storedSession[k] + " Found: " + sessionCookie[k] + "\n");
            return false;
        }
    }
    if(storedSession.expires < Date.now()){
        console.log("Expired session");
        return false; // could delete expired ones here and increment with count var instead of size but eh
    }
    return true;  
}

app.get('/', async (req, res) => {
    console.log('GET recvd, checking cookie');
    let cookie;
    try{
       cookie = JSON.parse(req.cookies.auth); 
    } catch (err) {
        console.log("No cookie or invalid cookie found: " + req.cookies.auth + "\n");
        res.redirect('../login.html');
        return;
    }
    
    if (isValidSession(cookie, cookie.key)){
        const role = sessions.get(cookie.key).role;
        console.log("Valid session redirecting to: " + role + '\n')
        role === 'reader' ? 
            res.redirect('../reader.html') : 
            res.redirect('../author.html');
    }
    else{
        console.log("Invalid session redirecting to login \n");
        res.redirect('../login.html');
    }
});

app.get('/role', async (req, res) => {
    console.log('GET /role recvd, checking cookie');
    let cookie;
    try{
       cookie = JSON.parse(req.cookies.auth); 
    } catch (err) {
        console.log("No cookie or invalid cookie found: " + req.cookies.auth + "\n");
        res.send({isActive: false, isAuthor: false});
        return;
    }
    
    if (isValidSession(cookie, cookie.key)){
        const role = sessions.get(cookie.key).role;
        console.log("Valid session responding with role: " + role + '\n')
        role === 'reader' ? 
            res.send({isActive: true, isAuthor: false}): 
            res.send({isActive: true, isAuthor: true});
    }
    else{
        console.log("Invalid session\n");
        res.send({isActive: false, isAuthor: false});
    }
})