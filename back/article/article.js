import express, { json } from 'express';
import { MongoClient, Timestamp, ObjectId } from 'mongodb';
import { addComment } from './comment.js';
import cookieParser from 'cookie-parser';
import {authMiddleware} from './authMiddleware.js';

const mongoURI = 'mongodb://host.docker.internal:27017'
const client = new MongoClient(mongoURI);
async function connect() {
    await client.connect();
}
connect();

const hostname = '0.0.0.0';
const port = 3011;

const app = express();
app.use(json()); //make middleware like this for autho checks
app.use(cookieParser());
app.use(authMiddleware);
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

app.get('/', async (req, res) => {
    console.log('GET recieved with query ' + JSON.stringify(req.query) + '\n');
    const {id, title, page} = req.query;
    const _page = page ? page * 10: 0;
    let query;
    try{
        query = id? new ObjectId(id) : title ? {title: {$regex: title, $options: 'i'}} : {};
    }catch(err) {
        console.log('Error making ObjectID with ID: ' + id + '\n');
        res.status(400).send({
            message: "bad object id"
        });
        return;
    }

    console.log('Searching for documents with query: ' + JSON.stringify(query) + '\n');
    await client.db('daily_bugle').collection('article')
        .find(query, {limit: 10, skip: _page})
        .toArray()
        .then(result => {
            console.log('Found documents: ' + JSON.stringify(result) + '\n');
            res.send(result);
        }).catch(err => {
            console.log('Error finding documents ' + err);
            res.status(500).send({
                message: err,
            });
        })
})

/**
 * This builds a MongoDB update query
 * @param {Array<string>} possibleFields List of possible fields to update
 * @param {Object} reqBody HTTP Request Body
 * @param {Object} starterUpdate Base update - ex. use to include date modified
 */
const buildUpdate = (possibleFields, reqBody, starterUpdate={}) => {
    let update = starterUpdate;
    Object.keys(reqBody).forEach((k) => {
        if(possibleFields.includes(k)){
            update[k] = reqBody[k];
        }
    });
    return {
        $set: update
    };
}

app.put('/', async (req, res) => {
    console.log('PUT recieved with req body: ' + JSON.stringify(req.body) + '\n')
    if(!req.query?.id){
        res.status(400).send({
            message: "no ID included in PUT"
        })
        return;
    }
    const filter = {_id: new ObjectId(req.query.id)};
    const update = buildUpdate(
        ['title', 'teaser', 'body', 'categories'], 
        req.body,
        {dateLastEdited: new Date(Date.now())},
    );
    await client.db('daily_bugle').collection('article')
        .updateOne(filter, update)
        .then(result => {
            console.log('updated artice ' + JSON.stringify(filter) + '\nwith changes ' + JSON.stringify(update) + '\nresults: ' + JSON.stringify(result) + '\n');
            res.send(result);
        })
        .catch(err => {
            console.log('Error updating' + JSON.stringify(filter) + '\ncode: ' + err + '\n');
            res.status(400).send({
                message: err
            });
        });
})

app.put('/comment', async (req, res) => {
    addComment(req, res, client);
})