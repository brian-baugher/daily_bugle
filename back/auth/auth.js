import express, { json } from 'express';
import { MongoClient, Timestamp, ObjectId } from 'mongodb';

const mongoURI = 'mongodb://localhost:27017' //'mongodb://host.docker.internal:27017'
const client = new MongoClient(mongoURI);
async function connect() {
    await client.connect();
}
connect();

const hostname = '0.0.0.0';
const port = 3013;

const app = express();
app.use(json());
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
            sessions.has(result._id.toString()) ? null : sessions.set(result._id.toString(), sessions.size);
            const cookie = {
                user: username,
                key: sessions.get(result._id.toString()),
                userAgent: req.headers['user-agent'],
                ip: req.ip,
                role: result.role,
            }
            console.log('User found, logging in and setting cookie: ' + JSON.stringify(cookie) + '\n');
            res.cookie('auth', cookie, {
                expires: new Date(Date.now() + 86400000), // now plus 1 day
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