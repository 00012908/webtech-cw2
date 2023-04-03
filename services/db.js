const fs = require("fs");
const path = require("path");
const { post } = require("../routes");

const generateID = require("../utils").generateID;
const root = require("../utils").root;

class DbContext {
  constructor(collection = "") {
    this.collection = path.join(root, `database/${collection}`);
  }

  getOne(id, successCb, errorCb) {
    try {
      fs.readFile(this.collection, "utf8", (err, data) => {
        if (err) errorCb();

        const records = JSON.parse(data);
        const record = records.filter((record) => record.id == id)[0];
        successCb(record);
      });
    } catch (err) {
      errorCb(err)
    }
  }

  getAll(successCb, errorCb) {
    try {
      fs.readFile(this.collection, "utf8", (err, data) => {
        if (err) errorCb();

        const records = JSON.parse(data);
        const posts = records.filter(record => !record.archived || record.archived == false)
        successCb(posts);
      });
    } catch (err) {
      errorCb(err)
    }
  }

  saveOne(newRecord, successCb, errorCb) {
    try {
      fs.readFile(this.collection, "utf8", (err, data) => {
        if (err) errorCb();

        const records = JSON.parse(data);

        records.push({
          id: generateID(),
          author: newRecord.author,
          title: newRecord.title,
          body: newRecord.body,
          archived: false,
        });

        fs.writeFile(this.collection, JSON.stringify(records, null, 4), (err) => {
          if (err) errorCb();
          successCb();
        });
      });
    } catch (err) {
      errorCb(err)
    }
  }

  deleteOne(id, successCb, errorCb) {
    try {
      fs.readFile(this.collection, "utf8", (err, data) => {
        if (err) errorCb();

        const records = JSON.parse(data);

        const filtered = records.filter((record) => record.id != id) || [];

        fs.writeFile(this.collection, JSON.stringify(filtered, null, 4), (err) => {
          if (err) errorCb();
          successCb();
        });
      });
    } catch (err) {
      errorCb(err)
    }
  }

  archiveOne(id, successCb, errorCb) {
    try {
      fs.readFile(this.collection, "utf8", (err, data) => {
        if (err) errorCb(err);

        let posts = JSON.parse(data);
        for (let i = 0; i < posts.length; i++) {
          if (posts[i].id == id) {
            posts[i].archived = true
            fs.writeFile(this.collection, JSON.stringify(posts, null, 4), err => {
              if (err) errorCb(err);
            })

            return successCb()
          }
        }

        // post not found
        return errorCb(new Error('post not found'))
      });
    } catch (err) {
      errorCb(err)
    }
  }

  unarchiveOne(id, successCb, errorCb) {
    try {
      fs.readFile(this.collection, "utf8", (err, data) => {
        if (err) errorCb(err);

        let posts = JSON.parse(data);
        for (let i = 0; i < posts.length; i++) {
          if (posts[i].id == id) {
            posts[i].archived = false
            fs.writeFile(this.collection, JSON.stringify(posts, null, 4), err => {
              if (err) errorCb(err);
            })

            return successCb()
          }
        }

        // post not found
        return errorCb(new Error('post not found'))
      });
    } catch (err) {
      errorCb(err)
    }
  }

  getAllArchived(successCb, errorCb) {
    try {
      fs.readFile(this.collection, 'utf8', (err, data) => {
        if (err) return errorCb(err)
        const records = JSON.parse(data)
        const archived = records.filter(record => record.archived == true)
        return successCb(archived)
      })
    } catch (err) {
      errorCb(err)
    }
  }
}

module.exports = DbContext;
