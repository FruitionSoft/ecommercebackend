var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://test-node-a556f-default-rtdb.firebaseio.com",
});

module.exports = admin;
