const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// ----------------------------------------------------------------

recordRoutes.route("/").get(function (req, res){
  res.end('Server connection . . .')
});

// GET: sensor temperature
recordRoutes.route("/sensors").get(function (req, res) {
  let db_connect = dbo.getDb("iiot_db");
  db_connect
    .collection("sensor").find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// GET: id sensor
recordRoutes.route("/sensor/:id").get(function (req, res){
  let db_connect = dbo.getDb("iiot_db");
  let sensor_id = { _id: ObjectId( req.params.id )};
  db_connect
    .collection("sensor").findOne(sensor_id, function(err, result){
      if (err) throw err;
      res.json(result);
    });
});


// POST: temperature
recordRoutes.route("/sensor/temp").post(function (req, res){
  let db_connect = dbo.getDb("iiot_db");
  let new_temp = {
    valueTemp : req.body.valueTemp,
    sensor    : req.body.sensor,
    connect   : req.body.connect,
  };
  db_connect
    .collection("sensor").insertOne(new_temp, function(err, result){
      if (err) throw err;
      res.json(result);
    });
});


module.exports = recordRoutes;
