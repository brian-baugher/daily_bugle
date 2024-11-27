import express, { json } from 'express';
import { MongoClient, Timestamp, ObjectId } from 'mongodb';

const mongoURI = 'mongodb://localhost:27017'
const client = new MongoClient(mongoURI);
async function connect() {
    await client.connect();
}
connect();

const hostname = '0.0.0.0';
const port = 3012;

const app = express();
app.use(json());
app.listen(port, hostname, () => {console.log(`listening at http://${hostname}:${port}`)});

app.get('/', async (req, res) => {
    console.log('GET recieved \n');

    await client.db('daily_bugle').collection('ad')
        .find({})
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
});

app.put('/impression', async (req, res) => {
    const {eventType, user, article} = req.body;
    if(!req.query?.ad){
        res.status(400).send({
            message: "no ad ID included in PUT"
        })
        return;
    }
    let adId;
    let userId;
    let articleId;
    try{
        adId = new ObjectId(req.query.ad);
        userId = new ObjectId(user); //TODO: make userID optional for ad tracking (nvm this just works somehow)
        articleId = new ObjectId(article);
    } catch (err) {
        res.status(400).send({
            message: "invalid ID for ad, user, or article"
        })
        return;
    }

    const adEvent = {
        ad: adId,
        user: userId,
        article: articleId,
        eventType: eventType,
        userAgent: req.headers['user-agent'],
        userIp: req.ip, 
        dateCreated: new Date(Date.now()),
    }
    await client.db('daily_bugle').collection('adEvent')
        .insertOne(adEvent)
        .then(result => {
            console.log('inserted new adEvent ' + JSON.stringify(adEvent) + '\nresults: ' + JSON.stringify(result) + '\n');
            res.send(result);
        })
        .catch(err => {
            console.log('Error inserting ' + JSON.stringify(adEvent) + '\ncode: ' + err + '\n');
            res.status(400).send({
                message: err
            });
        });
});
