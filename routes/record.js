const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// ----------------------------------------------------------------

recordRoutes.route("/").get(function (req, res){
 res.end('Hello world')
});

// GET: user
recordRoutes.route("/sensors").get(function (req, res) {
 let db_connect = dbo.getDb("iiot_db");
 db_connect
   .collection("sensor")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});

module.exports = recordRoutes;
