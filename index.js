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
    const transportCollection = client
      .db("TransportNotice")
      .collection("notices");
    const GeneralPostCollection = client.db("GeneralPosts").collection("posts");
    const selectedPostUniversityCollection = client
      .db("SelectedPostList")
      .collection("universitypost");
    const selectedPostDepartmentCollection = client
      .db("SelectedPostList")
      .collection("departmentpost");
    const selectedPostTeacherCollection = client
      .db("SelectedPostList")
      .collection("teacherpost");
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
    //showing selected posts in department route ********************* statically added
    app.post("/selectedpost", async (req, res) => {
      //  ====================== can be used to dynamically add data(start)
      // ============================== static part

      const newPost = req.body;
      if (newPost.postType === 0) {
        const result = await selectedPostUniversityCollection.insertOne(
          newPost
        );
        res.send(result);
      } else if (newPost.postType === 1) {
        const result = await selectedPostDepartmentCollection.insertOne(
          newPost
        );
        res.send(result);
      } else {
        const result = await selectedPostTeacherCollection.insertOne(newPost);
        res.send(result);
      }

      console.log("Added new post: ", newPost);
      // const result1 = await selectedPostDepartmentCollection.insertOne({
      //   newPostDepartment,
      // });
      // const result2 = await selectedPostTeacherCollection.insertOne({
      //   newPostTeacher,
      // });
      // ===============================================================================
    });
    // ============================ have to be uncommented to dynacally add data(end)
    app.post("/transportnotice", async (req, res) => {
      const newNotice = req.body;
      const result = await transportCollection.insertOne(newNotice);
      res.send(result);
      console.log("Added new transport notice", newNotice);
    });
    app.get("/transportnotice", async (req, res) => {
      const query = {};
      const cursor = transportCollection.find(query);
      const notices = await cursor.toArray();
      res.send(notices);
    });
    app.post("/generalposts", async (req, res) => {
      const newPost = req.body;
      const result = await GeneralPostCollection.insertOne(newPost);
      res.send(result);
      console.log("Added new post: ", newPost);
    });
    app.get("/generalposts", async (req, res) => {
      const query = {};
      const cursor = GeneralPostCollection.find(query);
      const generalposts = await cursor.toArray();
      res.send(generalposts);
    });

    app.get("/selectedpost", async (req, res) => {
      const query = {};
      const cursor = selectedPostUniversityCollection.find(query);
      const cursor1 = selectedPostDepartmentCollection.find(query);
      const cursor2 = selectedPostTeacherCollection.find(query);
      const universitypost = await cursor.toArray();
      const departmentpost = await cursor1.toArray();
      const teacherpost = await cursor2.toArray();
      const all = [universitypost, departmentpost, teacherpost];

      res.send(all);
    });
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = studentCollection.find(query);
      const cursor1 = teacherCollection.find(query);
      const studentList = await cursor.toArray();
      const teacherList = await cursor1.toArray();
      const all = [studentList, teacherList];

      res.send(all);
    });
  } finally {
    // client.close();
  }
}

run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Welcome to the server side of LU Community Forum");
});

app.listen(port, () => {
  console.log("server is on at :", port);
});
