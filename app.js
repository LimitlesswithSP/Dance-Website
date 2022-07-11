const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");

// Including mongoose in our project and opening a connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/contactDance', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = 8000;

// Establishing the pending connection to the contactDance database running on localhost
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    // console.log("We are Connected.");
});

// Initiating a schema with the specific properties
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String
});

// Compiling the declared schema(contactSchema) into a mongoose model(Contact) which corresponds to the contactForm("contactforms") collection in the database
const Contact = mongoose.model('contactForm', contactSchema);

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static'));   // For serving static files
app.use(express.urlencoded());  // To recognize the incoming Request Object as strings or arrays

// PUG SPECIFIC STUFF
app.set('view engine', 'pug');  // Set the template engine as pug
app.set('views', path.join(__dirname, 'views'));    // Set the views directory

// ENDPOINTS
app.get('/', (req, res) => {
    const params = {};
    res.status(200).render('home.pug', params);
});

app.get('/contact', (req, res) => {
    const params = {};
    res.status(200).render('contact.pug', params);
});

app.post('/contact', (req, res) => {
    var myData = new Contact(req.body);
    myData.save().then(() => {
        res.send("This item has been saved to the database");
    }).catch(() => {
        res.status(400).send("item was not saved to the database");
    });
});

// app.post('/contact', (req, res) => {
//     var myData = new Contact(req.body);
//     myData.save(function (err, result) {
//         if (err) {
//             res.status(400).send("item was not saved to the database");
//         }
//         else {
//             res.send("This item has been saved to the database");
//         }
//     });
// });

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});