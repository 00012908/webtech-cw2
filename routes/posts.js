const express = require("express");
const router = express.Router();
const Validator = require("../services/validators");
const DbContext = require("../services/db");
const dbc = new DbContext('posts.json');
const validator = new Validator();

router.get("/", (req, res) => {
  dbc.getAll(
    (records) =>
      res.render("all_posts", { title: "List of All Posts", posts: records }),
    () => res.render("all_posts", { title: "List of All Posts", posts: null })
  );
});

router.get("/create-post", (req, res) => {
  res.render("create_post", { title: "New Post Form" });
});

router.post("/create-post", (req, res) => {
  console.log('123456',req.body)
  if (validator.isValid(req.body)) {
    dbc.saveOne(req.body, () => {
      res.redirect('/posts')
      // res.render("create_post", { success: true })
    });

  } else {
    res.render("create_post", { error: true, success: false });
  }
});

router.get("/:id/delete", (req, res) => {
  dbc.deleteOne(req.params.id, () => res.redirect("/posts")),
    () => res.sendStatus(500);
});

router.get("/:id/archive", (req, res) => {
  dbc.archiveOne(req.params.id, () => {
    res.redirect("/posts");
  }, (err) => {
    if (err) res.sendStatus(500);
  })

});

router.get("/:id/unarchive", (req, res) => {
  dbc.unarchiveOne(req.params.id, () => {
    res.redirect("/archive");
  }, (err) => {
    if (err) res.sendStatus(500);
  })

});

router.get("/:id", (req, res) => {
  dbc.getOne(
    req.params.id,
    (record) =>
      res.render("post_detail", { title: `${record.title}`, post: record }),
    () => res.sendStatus(404)
  );
});

module.exports = router;
