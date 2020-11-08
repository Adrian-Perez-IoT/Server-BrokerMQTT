const express = require("express");
const Notification = require ("./notifications.js");
// const GenerateToken = require("./generateToken.js") // only needed if you want to generate your own tokens

const app = express();

app.get("/one-user", function(req,res){
    res.send("sending notification");
    const data = {
        tokenId: "esXH_nLk5F0:APA91bGIPzBuU0yAHAe2wfLlGZYEhfuMO0o8sHDb3CAsr1ZzcnPmIcqrZwP4mSvX5aB2qoLYLgG7W2_A-iaE0gq4m0qSXyYY2gKAWPLxw9aK6wm058-jdYGXyuGrLnbt-PF8YhxjPx9l",
        titulo: "myTitulo",
        mensaje: "mymensaje"
    };
    Notification.sendPushToOneUser(data);    
});

app.get("/", function(req, res) {
    res.send("Respuesta de la peticion get. Satisfactorio")
});

app.listen(3000, function() {
    console.log("Server started on port 3000");

});

console.log(`Environment: ${process.env.NODE_ENV}`);