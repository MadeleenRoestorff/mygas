"use strict";
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Gas = require("./gas-module");

// Middleware
router.use(bodyParser.json());

router.get("/:id(\\d+)", (req, res) => {
  Gas.getInstance(req.params.id).then((gasData) => {
    res.json(gasData);
    console.log("gasData", gasData);
    console.log(Object.keys(res.req));
  });
});
router.route("/").get((req, res) => {
  Gas.getList().then((gasData) => {
    const fieldsList = gasData.map((gas) => gas.fields);
    res.json(fieldsList);
    console.log("gasData", gasData);
    console.log(
      "gasData fields",
      gasData.map((gas) => gas.fields)
    );
  });
});

//   .post((req, res) => {
//     createGas(req.body).then((gasData) => {
//       res.json(gasData);
//       console.log(Object.keys(res.req.body));
//     });
//   })
//   .put((req, res) => {
//     updateGas(req.body).then((gasData) => {
//       res.json(gasData);
//       console.log(Object.keys(res.req.body));
//     });
//   });

module.exports = router;
