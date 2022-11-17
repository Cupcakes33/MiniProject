const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8000;
let db;

MongoClient.connect(
  "",
  { useUnifiedTopology: true },
  (error, client) => {
    if (error) return console.log("error");
    db = client.db("db");
  }
);

app.listen(port, () => {
  console.log("listening on 8000");
});

app.post("/postdata", (reqPost, resPost) => {
  resPost.send("success");
  let Posting = reqPost.body;
  db.collection("counter").findOne(
    { name: "checklistCounter" },
    (error, res) => {
      let count = res.checklistCount;
      db.collection("checklist").insertOne(
        {
          _id: count,
          content: Posting.content,
          category: Posting.category,
          done: Posting.done,
        },
        (error, res) => {
          console.log("res");
          db.collection("counter").updateOne(
            { name: "checklistCounter" },
            { $inc: { checklistCount: 1 } },
            function () {}
          );
        }
      );
    }
  );
});

app.put("/done", (putReq, putRes) => {
  const list = putReq.body.list;
  const id = list._id;

  db.collection("checklist").updateOne(
    { _id: id },
    { $set: { done: true } },
    function () {}
  );

  putRes.send("done");
});

app.put("/notDone", (putReq, putRes) => {
  const list = putReq.body.list;
  const id = list._id;

  db.collection("checklist").updateOne(
    { _id: id },
    { $set: { done: false } },
    function () {}
  );

  putRes.send("done");
});

app.put("/editData", (putReq, putRes) => {
  const list = putReq.body.list;
  const id = list._id;
  const targetVal = putReq.body.targetVal;

  db.collection("checklist").updateOne(
    { _id: id },
    { $set: { content: targetVal } },
    function () {}
  );
});

app.delete("/deleteData", (deleteReq, deleteRes) => {
  const list = deleteReq.body;
  db.collection("checklist").deleteOne(list, function (error, res) {});
});

app.get("/getData", (req, res) => {
  db.collection("checklist")
    .find()
    .toArray((error, data) => {
      res.json(data);
    });
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/todolist.html");
});
