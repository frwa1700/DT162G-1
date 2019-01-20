var express = require('express');
var router = express.Router();

/* Adding MongoDB-support */
const mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    mongoUrl = 'mongodb://localhost:27017';

/* Variables to use with MongoDB */
var db,
    collection;

/* Version 3.0 of mongodb returns client-object instead of db */
MongoClient.connect(mongoUrl, function (err, client) {
    if (err) {
        console.log('Unable to connect. Error:', err);
    } else {
        db = client.db('dt162g-project');// Creates db-object
        collection = db.collection('products');
    }
});

/* Get all products */
router.get('/', function(req, res, next) {
    let query,
        orderBy;

    if (req.query.name) {
        query = {name: new RegExp(`.*${req.query.name}\.*`, 'i') };
        orderBy = (req.query.orderBy) ? { name: 1} : "";
    }

    let limit = (req.query.limit) ? parseInt(req.query.limit) : 0;

    collection.find(query).limit(limit).sort(orderBy).toArray(function (err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            res.send(result);
        } else {
            res.status(204).send("error : nothing found.");
        }
    });
});

/* Get single product */
router.get('/:id', function(req, res, next) {
    var id = req.params.id,
        o_id = mongodb.ObjectID(id); // Create ObjectID-object

    /* Get all documents from the collection  */
    collection.find( {'_id': o_id}).toArray(function (err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            console.log('Found something with id:' + id);
            res.send(result);
        } else {
            console.log('Nothing found with id:' + id);
            res.send('Nothing found with id:' + id);
        }
    });

});

/* Post to add a new product */
router.post('/', function(req, res, next){
    if (req.body)
        collection.insertOne(req.body, function (err, result) {
            if (err) {
                console.log('Posting failed. Data is:' + req.body);
                res.status(400).send("error : \"Post failed\"");
            } else {
                console.log('Insert new post successful.')
                res.status(200).send("success : \"Posted Successfully\"");
            }
        })
});

// Delete a product
router.delete('/:id', function(req, res, next) {
    var id = req.params.id,
        o_id = mongodb.ObjectID(id); // Create ObjectID-object
    console.log("We got a delete request");
    collection.deleteOne( {'_id': o_id}, function (err) {
        if (err) {
            console.log("Error when deleting. "+ err)
            res.status(400).send("Error when deleting.");
        } else {
            res.status(204).send("Success");
        }
    });
});

// Update a product
router.put('/:id', function(req, res, next) {
    var id = req.params.id,
        o_id = mongodb.ObjectID(id); // Create ObjectID-object
    var updateData = {
        $set: req.body
    };
    collection.updateOne( {'_id': o_id}, updateData, function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send("error : \"Update failed\"");
        } else {
            console.log("Update successful");
            res.status(200).send("success : \"Updated Successfully\"");
        }
    });

});

module.exports = router;
