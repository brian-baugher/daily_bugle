import { MongoClient, ObjectId } from 'mongodb';

/**
 *  
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {MongoClient} client
 * @returns 
 */
const addComment = async (req, res, client) => {   
   console.log('Comment PUT recieved with req body: ' + JSON.stringify(req.body) + '\n')
    if(!req.query?.id){
        res.status(400).send({
            message: "no ID included in PUT"
        })
        return;
    }
    const filter = {_id: new ObjectId(req.query.id)};
    const update = {
        $push: {comments: req.body.comment},    // not changing lastEdited here because comments don't feel like an edit
    };
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
}

export {addComment}