const express = require("express");
const router = express.Router();
const DbContext = require("../services/db");
const dbc = new DbContext('posts.json');

router.get("/", (req, res) => {
    dbc.getAllArchived(posts => {
        res.render("all_posts", { title: "Archived Posts", posts: posts });
    }, err => {
        if (err) res.sendStatus(500);
    })
});


module.exports = router;
