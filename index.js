const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 9000;
const ObjectId = require("mongodb").ObjectId;

// Middleware use
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://lucfdb:wCWLK7BPmJnUQyIv@cluster0.nookjda.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const user = { email: "cse_1832020032@lus.ac.bd" };
    const reportedPostCollection = client
      .db("GeneralPosts")
      .collection("reportedUserPost");
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
    // ==================== All general post releted api's ===================

    // for adding new posts
    app.post("/generalposts", async (req, res) => {
      const newPost = req.body;
      const result = await GeneralPostCollection.insertOne(newPost);
      res.send(result);
      console.log("Added new post: ", newPost);
    });

    // for getting all the general posts

    app.get("/generalposts", async (req, res) => {
      const query = {};
      const cursor = GeneralPostCollection.find(query);
      const generalposts = await cursor.toArray();
      res.send(generalposts);
    });

    // for getting single post from general post using query

    app.get("/generalposts/:id", async (req, res) => {
      const postId = req.params.id;
      const query = { _id: ObjectId(postId) };
      const singlePost = await GeneralPostCollection.findOne(query, {});
      res.send(singlePost);
    });
    // for getting all the posts of a single user in a array

    app.get("/allSingleUserPost/:id",async (req,res)=>{
      const userEmail = req.params.id;
      const query = {email: userEmail};
      const cursor =  GeneralPostCollection.find(query,{});
      const allSingleUserPost = await cursor.toArray();
      res.send(allSingleUserPost);
    })
    // for posting comments in single general post

    app.put("/singlepost/:id", async (req, res) => {
      const postId = req.params.id;
      const commentBody = req.body;
      const options = { upsert: true };
      // console.log(commentBody);
      const query = { _id: ObjectId(postId) };
      const singlePost = await GeneralPostCollection.findOne(query, {});
      const comments = singlePost.comments;
      const newCommentArray = [...comments, commentBody];
      // console.log(newCommentArray);
      const updatedComments = {
        $set: {
          comments: newCommentArray,
        },
      };
      const result = await GeneralPostCollection.updateOne(
        query,
        updatedComments,
        options
      );
      const found = userCollection.find((u) => u.email === email);
    });

    // for updating like in single general post
    app.put("/generalposts/:id", async (req, res) => {
      const paramsId = req.params.id;
      const [postId, email] = paramsId.split("++");
      // console.log(postId);
      const query = { _id: ObjectId(postId) };
      // finding the post for which the like array has to be updated
      const singlePost = await GeneralPostCollection.findOne(query, {});
      const likes = singlePost.likes;
      const options = { upsert: true };
      let likesArray;
      if (likes.length !== 0) {
        const found = likes.find((u) => u === email);
        if (found) {
          console.log("email found");
          likesArray = likes.filter((u) => u !== email);

          const updatedLikes = {
            $set: {
              likes: likesArray,
            },
          };

          const result = await GeneralPostCollection.updateOne(
            query,
            updatedLikes,
            options
          );
        } else {
          console.log("email not found");
          likesArray = [...likes, email];
          // console.log("updated", likesArray);
          const updatedLikes = {
            $set: {
              likes: likesArray,
            },
          };

          const result = await GeneralPostCollection.updateOne(
            query,
            updatedLikes,
            options
          );
        }
      }
      if (likes.length === 0) {
        const likesEmailArray = [email];
        const updatedLikes = {
          $set: {
            likes: likesEmailArray,
          },
        };

        const result = await GeneralPostCollection.updateOne(
          query,
          updatedLikes,
          options
        );
      }
      // console.log(singlePost);
      res.send(singlePost);
    });
    // for reporting posts

    app.post("/generalposts/reported", async (req, res) => {
      const post = req.body;
      console.log(post);
      const result = await reportedPostCollection.insertOne(post);
      res.send(result);
    });

    // for deleting single comments from the individual posts

    app.put("/singlecomment/:id", async (req, res) => {
      const postId = req.params.id;
      const commentId = req.body.id;
      const query = { _id: ObjectId(postId) };
      // First finding the post by its id
      const singlePost = await GeneralPostCollection.findOne(query, {});
      const oldCommentsArray = singlePost.comments;
      const updatedCommentArray = oldCommentsArray.filter(
        (u) => u.commentId !== commentId
      );
      console.log("updated comment ", updatedCommentArray);
      const newCommentArray = {
        $set: {
          comments: updatedCommentArray,
        },
      };
      console.log("new COmment array ", updatedCommentArray);
      const options = { upsert: true };
      const result = await GeneralPostCollection.updateOne(
        query,
        newCommentArray
      );
      console.log(result);
      res.send(result);
      // res.send({ stat: "success" });
    });

    // for deleting single post by user

    app.delete("/generalposts/:id", async (req, res) => {
      const postId = req.params.id;
      const query = { _id: ObjectId(postId) };
      const result = await GeneralPostCollection.deleteOne(query);
      res.send(result);
    });

    // Different post api
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
    // All user profile api link
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = studentCollection.find(query);
      const cursor1 = teacherCollection.find(query);
      const studentList = await cursor.toArray();
      const teacherList = await cursor1.toArray();
      const all = [studentList, teacherList];

      res.send(all);
    });
    // single user information api link using mail
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const emailreg = /^(cse|eee|ce|eng)[_]\d{10}[@]lus[.]ac[.]bd$/.test(id);
      const query = { email: id };
      if (emailreg) {
        const student_cursor = await studentCollection.findOne(query);
        res.send(student_cursor);
        console.log(student_cursor);
      } else {
        const teacher_cursor = await teacherCollection.findOne(query);
        res.send(teacher_cursor);
        console.log(teacher_cursor);
      }
      console.log(id);
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
