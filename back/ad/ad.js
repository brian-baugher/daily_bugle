import express, { json } from 'express';
import { MongoClient, Timestamp, ObjectId } from 'mongodb';

const mongoURI = 'mongodb://localhost:27017' //'mongodb://host.docker.internal:27017'
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
    const {page} = req.query;
    const _page = page ? page * 10: 0;

    await client.db('daily_bugle').collection('ad')
        .find({}, {limit: 10, skip: _page})
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