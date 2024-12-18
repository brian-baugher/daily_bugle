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
    let filter;
    let update;
    try{
        filter = {_id: new ObjectId(req.query.id)};
        update = {
            $push: {comments: {
                comment: req.body.comment,
                dateCreated: new Date(Date.now()),
                contributor: new ObjectId(req.cookies.auth.userId)  // TODO: test 
            }},    
        };
    } catch (err) {
        console.log("error building filter or update: " + err + '\n');
        res.status(400).send({
            message: "invalid ID"
        });
    }
    
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