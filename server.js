const express = require("express");
const app = express();
// const axios = require("axios");
const bodyParser = require("body-parser");

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/todo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var Schema = mongoose.Schema;

var tasks = new Schema({
  caption: String,
  isCompleted: Boolean,
});
var todo = mongoose.model("todo", tasks);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  todo.find({}, (err, task) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        data: task,
      });
    }
  });
});

app.post("/checkbox/:id", (req, res) => {
  var isCompleted = req.body.checkbox;
  todo.findById(req.params.id, (err, Todo) => {
    console.log(Todo.isCompleted);
    Todo.update({
        $set: {
          isCompleted: !Todo.isCompleted,
        },
      },
      (err, result) => {
        if (err) console.log(err);
        console.log(result);
      }
    );
  });
  res.redirect("/");
});

app.post("/removeTask/:id", (req, res) => {
  var id = req.params.id;
  console.log(id);
  todo.findByIdAndRemove(id, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Item removed");
    }
  });
  res.redirect("/");
});

app.post("/completed", (req, res) => {
  var tasks = [];
  todo.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result[0].isCompleted);
      for (var i = 0; i < result.length; i++) {
        if (result[i].isCompleted) {
          tasks.push(result[i]);
        }
      }
      res.render("index", {
        data: tasks,
      });
    }
  });
});

app.post("/active", (req, res) => {
  var tasks = [];
  todo.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result[0].isCompleted);
      for (var i = 0; i < result.length; i++) {
        if (result[i].isCompleted == false) {
          tasks.push(result[i]);
        }
      }
      res.render("index", {
        data: tasks,
      });
    }
  });
});

app.post("/addTodo", (req, res) => {
  var task = new todo({
    caption: req.body.userInput,
    isCompleted: false,
  });
  if (req.body.userInput == "") {
    // res.send('Input cannot be empty!', 404);
    res.status(404).send("Input cannot be empty!");
  } else {
    todo.create(task, (err, todo) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Item inserted");
      }
    });
  }
  res.redirect("/");
});

// app.get('/error', function (req, res) {
//   res.render("index");
// })

app.listen(3000, () => {
  console.log("server is up");
});