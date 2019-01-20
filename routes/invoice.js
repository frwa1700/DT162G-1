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
        collection = db.collection('invoice');
    }
});

/* Get all invoices */
router.get('/', function(req, res, next) {
    collection.find().toArray(function (err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            console.log("Found something");
            res.send(result);
        } else {
            console.log('Nothing found');
            res.send("Error: nothing found.");
        }
    });
});
/* Get single invoice */
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

// Add a new invoice
router.post('/', function(req, res, next){
    if (req.body) {
        req.body.dateCreated = new Date();

        collection.insertOne(req.body, function (err, result) {
            if (err) {
                console.log('Posting invoice failed. Data is:' + req.body);
                res.status(400).send("error : \"Post failed\"");
            } else {
                res.status(200).send({ error: false, message: "Data added. Returns id.", id: req.body._id });
            }
        })
    }
});

// Delete an invoice
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

// Update an invoice
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
