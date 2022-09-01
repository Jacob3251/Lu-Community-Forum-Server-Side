const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 9000;
const ObjectId = require("mongodb").ObjectId;

// Middleware use
app.use(cors());
app.use(express.json());
// mongo User: lucfdb Pass: wCWLK7BPmJnUQyIv

const uri =
  "mongodb+srv://lucfdb:wCWLK7BPmJnUQyIv@cluster0.nookjda.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const user = { email: "cse_1832020032@lus.ac.bd" };

    const userCollection = client.db("UserList").collection("users");
    const studentCollection = client.db("UserList").collection("student");
    const teacherCollection = client.db("UserList").collection("teacher");
    // console.log(`user has been added to database ${result.insertedId}`);
    // getting logged users api
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    // posting users to their database (student/teacher)
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      const email = { email: newUser.email };
      const result = await userCollection.insertOne(email);
      if (newUser.userType === 1) {
        const result2 = await studentCollection.insertOne(newUser);

        res.send(result2);
        console.log("adding new student user", newUser);
      }
      if (newUser.userType === 2) {
        const result2 = await teacherCollection.insertOne(newUser);

        res.send(result2);
        console.log("adding new teacher user", newUser);
      }
      //   const result = await userCollection.insertOne(newUser);
      //   res.send({ result: "success", newUser });
    });
  } finally {
    // client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the server side of LU Community Forum");
});

app.listen(port, () => {
  console.log("server is on at :", port);
});
