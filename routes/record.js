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
// Global variable
let lastTemp = {};
let sensorPeriod = {};
//
recordRoutes.route("/").get(function (req, res){
  res.end('Server connection: main page')
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


// POST: temperature to "spisensor" collection
recordRoutes.route("/termopar/tipok").post(function (req, res){
  let db_connect = dbo.getDb("iiot_db");
  let new_temp = {
    tempTk : req.body.tempTk,
  };
  lastTemp = new_temp;
  db_connect
    .collection("spisensor").insertOne(new_temp, function(err, result){
      if (err) throw err;
      res.json(result);
    });
});

// GET: last temperature of thermocouple type k sensor 
recordRoutes.route("/spi/lasttemp").get(function (req, res){
  res.json(lastTemp);
});

// GET: All sensor temperature values
recordRoutes.route("/spi/all").get(function (req, res) {
  let db_connect = dbo.getDb("iiot_db");
  db_connect
    .collection("spisensor").find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// POST: sensor reading period
recordRoutes.route("/spi/setperiod").post(function (req, res){
  let new_period = {
    period : req.body.period,
  };
  sensorPeriod = new_period;
  res.send('POST request to the homepage\n')
});

// GET: last period of sensor 
recordRoutes.route("/spi/getperiod").get(function (req, res){
  res.json(sensorPeriod);
});

module.exports = recordRoutes;
