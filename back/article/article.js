const http = require('http');
const url = require('url');
const express = require('express');
const {MongoClient, Timestamp} = require('mongodb');

const mongoURI = 'mongodb://localhost:27017' //'mongodb://host.docker.internal:27017'
const client = new MongoClient(mongoURI);
async function connect() {
    await client.connect();
}
connect();

const hostname = '0.0.0.0';
const port = 3011;

const app = express();
app.use(express.json());
app.listen(port, hostname, () => {console.log(`listening at http://${hostname}:${port}`)});

app.post('/', async (req, res) => {
    console.log('POST recieved with req body: ' + JSON.stringify(req.body) + '\n')
    const article = {
        title: req.body?.title,
        teaser: req.body?.teaser,
        body: req.body?.body,
        dateCreated: new Date(Date.now()),
        dateLastEdited: new Date(Date.now()),
        categories: req.body?.categories,
        comments: [],
    }
    await client.db('daily_bugle').collection('article')
        .insertOne(article)
        .then(result => {
            console.log('inserted new artice ' + JSON.stringify(article) + '\nresults: ' + JSON.stringify(result) + '\n');
            res.send(result);
        })
        .catch(err => {
            console.log('Error inserting ' + JSON.stringify(article) + '\ncode: ' + err + '\n');
            res.status(400).send({
                message: err
            });
        });
})