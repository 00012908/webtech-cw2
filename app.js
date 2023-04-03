const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const PORT = 8080;

// serving static files
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// setting template engine
app.set("view engine", "pug");


// routes
const posts = require("./routes/posts");
const archive = require('./routes/archive');
const index = require('./routes/index');

app.use('/', index)
app.use("/posts", posts);
app.use('/archive', archive);


// listen for requests
app.listen(PORT, () => {
  console.log(`App is listening on port  http://localhost:${PORT}`);
});
