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
    const galleryPostCollection = client.db("GalleryPosts").collection("posts");
    const alumniPostCollection = client.db("AlumniPosts").collection("posts");
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
    // api's for specific teacher posts

    // get api for receiving teacherpost
    app.get("/selectedpost/teacherpost", async (req, res) => {
      const query = {};
      const teacherPostCursor = selectedPostTeacherCollection.find(query);
      const teacherPosts = await teacherPostCursor.toArray();

      res.send(teacherPosts);
    });

    // del api for deleting individual teacherpost

    app.delete("/selectedpost/teacherpost/:id", async (req, res) => {
      const postId = req.params.id;
      const query = { _id: ObjectId(postId) };
      const result = await selectedPostTeacherCollection.deleteOne(query);
      console.log("delete result", result);
      res.send(result);
    });

    // api's for specific university posts
    app.get("/selectedpost/unipost", async (req, res) => {
      const query = {};
      const universityPostCursor = selectedPostUniversityCollection.find(query);
      const uniPosts = await universityPostCursor.toArray();

      res.send(uniPosts);
    });

    // api's for specfic university post deletion

    app.delete("/selectedpost/unipost/:id", async (req, res) => {
      const postId = req.params.id;
      const query = { _id: ObjectId(postId) };
      const result = await selectedPostUniversityCollection.deleteOne(query);
      console.log("delete result", result);
      res.send(result);
    });

    // api's for specific department posts
    app.get("/selectedpost/deptpost", async (req, res) => {
      const query = {};
      const deptPostCursor = selectedPostDepartmentCollection.find(query);
      const deptPosts = await deptPostCursor.toArray();

      res.send(deptPosts);
    });

    // api for deleting individual specific department posts

    app.delete("/selectedpost/deptpost/:id", async (req, res) => {
      const postId = req.params.id;
      const query = { _id: ObjectId(postId) };
      const result = await selectedPostDepartmentCollection.deleteOne(query);
      console.log("delete result", result);
      res.send(result);
    });

    // =============================================
    // ============================ have to be uncommented to dynacally add data(end)
    app.delete("/transportnotice/:id", async (req, res) => {
      const postId = req.params.id;
      const query = { _id: ObjectId(postId) };
      const result = await transportCollection.deleteOne(query);
      console.log("delete result", result);
      res.send(result);
    });
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

    // alumni post upload
    app.post("/alumnipost", async (req, res) => {
      newGalleryPost = req.body;
      const result = await alumniPostCollection.insertOne(newGalleryPost);
      res.send(result);
      console.log("Added new alumni post", result);
    });
    app.delete("/alumnipost/:id", async (req, res) => {
      const postId = req.params.id;
      const query = { _id: ObjectId(postId) };
      console.log(postId);
      const result = await alumniPostCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send({
          staus: "deleted",
          comment: "Successfully deleted one document.",
        });
      } else {
        res.send({
          staus: "not deleted",
          comment: "No documents matched the query. Deleted 0 documents.",
        });
      }
    });
    app.get("/alumnipost", async (req, res) => {
      // newGalleryPost = req.body;
      const query = {};
      const resultCursor = alumniPostCollection.find(query);
      const result = await resultCursor.toArray();
      res.send(result);
      // console.log("Added new gallery post", result);
    });

    // Gallery post upload
    app.post("/gallerypost", async (req, res) => {
      newGalleryPost = req.body;
      const result = await galleryPostCollection.insertOne(newGalleryPost);
      res.send(result);
      console.log("Added new gallery post", result);
    });
    app.delete("/gallerypost/:id", async (req, res) => {
      const postId = req.params.id;
      const query = { _id: ObjectId(postId) };
      console.log(postId);
      const result = await galleryPostCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send({
          staus: "deleted",
          comment: "Successfully deleted one document.",
        });
      } else {
        res.send({
          staus: "not deleted",
          comment: "No documents matched the query. Deleted 0 documents.",
        });
      }
    });

    app.get("/gallerypost", async (req, res) => {
      // newGalleryPost = req.body;
      const query = {};
      const resultCursor = galleryPostCollection.find(query);
      const result = await resultCursor.toArray();
      res.send(result);
      // console.log("Added new gallery post", result);
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

    app.get("/allSingleUserPost/:id", async (req, res) => {
      const userEmail = req.params.id;
      const query = { email: userEmail };
      const cursor = GeneralPostCollection.find(query, {});
      const allSingleUserPost = await cursor.toArray();
      res.send(allSingleUserPost);
    });
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
          // console.log("email found");
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
          // console.log("email not found");
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
      // console.log(post);
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
      // console.log("updated comment ", updatedCommentArray);
      const newCommentArray = {
        $set: {
          comments: updatedCommentArray,
        },
      };
      // console.log("new COmment array ", updatedCommentArray);
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

    // Different posts api
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
    // Temporaray api for testing********************-----------------*********************------------------
    app.get("/selectedTech/cse_1832020032@lus.ac.bd", async (req, res) => {
      const allData = [
        {
          id: 1,
          name: "Md. Ebrahim Hossain",
          designation: "Assistant Professor",
          photoURL:
            "https://www.lus.ac.bd/wp-content/uploads/2020/01/Ebrahim-Hossain.jpg",
          courses: [
            "Computer Network",
            "Data Communication",
            "Digital Signal Processing",
            "Computer Security and Cryptography",
            "Distributed System",
            "System Analysis and Design",
            "Computer Graphics and Image processing",
            "Operating System Lab",
            "C programming Lab",
            "Computer Graphics Lab",
            "Computer Network Lab",
          ],
        },
        {
          id: 2,
          name: "Adil Ahmed Chowdhury",
          designation: "Lecturer",
          photoURL:
            "https://www.lus.ac.bd/wp-content/uploads/2020/07/adil-png.png",
          courses: [
            "Java Programming (Theory & Sessional)",
            "Cellular Mobile And Satellite Communication",
            "Discrete Mathematics",
            "Theory of Computation",
            "Data Communication",
            "Database Management System (Theory & Sessional)",
            "Computer Security and Cryptography",
            "Object-Oriented Programming (Theory & Sessional)",
            "Compiler Design and Construction (Theory & Sessional)",
            "Numerical Methods (Sessional)",
            "Introduction to Computing Sessional(Python)",
            "Structured Programming",
          ],
        },
        {
          id: 3,
          name: "Md. Jamaner Rahaman",
          designation: "Lecturer",
          photoURL:
            "https://www.lus.ac.bd/wp-content/uploads/2021/02/Capture.png",
          courses: [
            "Structured Programming (C)",
            "Object-oriented programming (Java)",
            "Introduction to Computers (Python)",
            "Artificial Intelligence",
            "Digital Signal Processing",
            "Database Management System",
            "Microprocessor, Assembly Language and Computer Interfacing",
            "Theory of Computation",
            "Engineering Drawing",
          ],
        },
        {
          id: 4,
          name: "Kazi Md. Jahid Hasan",
          designation: "Assistant Professor(Mathematics)",
          photoURL:
            "https://www.lus.ac.bd/wp-content/uploads/2020/06/jahid-1-scaled.jpg",
          courses: [
            "Differential and Integral Calculus",
            "Differential Equation and Fourier Analysis",
            "Coordinate Geometry and Vector Analysis",
            "Linear Algebra and Complex Analysis",
            "Laplace Transform",
          ],
        },
        {
          id: 5,
          name: "Arafat Habib Quraishi",
          designation: "Lecturer",
          photoURL:
            "https://www.lus.ac.bd/wp-content/uploads/2022/02/217A8685-scaled.jpg",
          courses: [
            "Computer Programming",
            "Data Structures",
            "Object Oriented Programming",
            "Database Management System",
            "Discrete Mathematics",
            "Computer Networks",
            "Computer Architecture and Design",
            "Software Engineering and Information System Design",
            "Digital Electronics",
            "Management Information System",
            "Data Warehousing and Data Mining",
            "Introduction to Computers",
            "Internet and E-Commerce",
          ],
        },
        {
          id: 6,
          name: "Sabia Akter Bhuiyan",
          designation: "Assistant Professor",
          photoURL:
            "https://www.lus.ac.bd/wp-content/uploads/2019/11/sabia_akter.jpg",
          courses: [
            "Differential and Integral Calculus",
            "Differential Equation and Fourier Analysis",
            "Coordinate Geometry and Vector Analysis",
            "Linear Algebra and Complex Analysis",
            "Laplace Transform",
            "Business Mathematics",
            "Probability and Statistics",
            "Discrete Mathematics",
          ],
        },
        {
          id: 7,
          name: "Rana M Luthfur Rahman Pir",
          designation: "Assistant Professor Proctor (Acting), LU",
          photoURL:
            "https://www.lus.ac.bd/wp-content/uploads/2022/03/465386_10150677640915709_891318216_o.jpg",
          courses: [
            "Computer Architecture and Design",
            "Computer Networks",
            "Data Warehousing and Data Mining",
            "Computer Security and Cryptography",
            "Management Information System",
            "System Analysis and Design",
            "Computer Peripherals and Interfacing",
            "Software Engineering",
            "Advanced Software Engineering",
            "Human-Computer Interaction",
            "Computer Peripherals and Interfacing",
            "Data Communication",
          ],
        },
        {
          id: 8,
          name: "Prof. Dr. AS. Sikder",
          designation: "Professor",
          photoURL: "https://www.lus.ac.bd/wp-content/uploads/2022/11/pic.jpg",
          courses: [
            "Software Engineering",
            "System Analysis & Design",
            "Database Management System",
            "Advanced Computer Networks",
            "Advanced Operating System",
            "Cryptography & Network Security",
            "Cyber Security & Ethical Hacking",
            "Information Systems Security",
            "Cloud Computing",
            "Advanced Algorithms",
            "Neural Network & Fuzzy Logic",
            "Machine Learning",
            "Big Data & Data Mining",
            "Data Analytics",
            "Business Analytics",
            "Management Information System",
          ],
        },
        {
          id: 9,
          name: "Syeda Tamanna Alam Monisha",
          designation: "Lecturer",
          photoURL:
            "https://www.lus.ac.bd/wp-content/uploads/2019/11/Syeda-Tajmanna-Alam-Monisha.jpg",
          courses: [
            "Computer Security and Cryptography",
            "Compiler Design and Construction",
            "Digital Signal Processing",
            "Artificial Intelligence",
            "Numerical Methods",
            "Data Communication",
            "Database Management System",
            "Object-Oriented Programming",
            "Data Structure",
            "Discrete Mathematics",
          ],
        },
      ];
      const id = "cse_1832020032@lus.ac.bd";
      res.send(allData);
    });
    // const all = { allTeacherData: allData ,  };

    // res.send(all);

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
        // console.log(student_cursor);
      } else {
        const teacher_cursor = await teacherCollection.findOne(query);
        res.send(teacher_cursor);
        // console.log(teacher_cursor);
      }
      // console.log(id);
    });
    // Subcribed Teacher: api
    app.put("/subscribedteachers/:id", async (req, res) => {
      const [userEmail, userType] = req.params.id.split("***");
      const requestedbody = req.body;
      const filter = { email: userEmail };
      const options = { upsert: true };
      const query = { email: userEmail };
      const UserData = await studentCollection.findOne(query, {});

      if (userType == 1) {
        if (!UserData.subscribedTeachers) {
          const updatedPart = {
            $set: {
              subscribedTeachers: [requestedbody.selectedId],
            },
          };
          const result = await studentCollection.updateOne(
            filter,
            updatedPart,
            options
          );
          res.send(result);
        } else {
          const modifiedArr = [
            ...UserData.subscribedTeachers,
            requestedbody.selectedId,
          ];
          const updatedPart = {
            $set: {
              subscribedTeachers: modifiedArr,
            },
          };
          const result = await studentCollection.updateOne(
            filter,
            updatedPart,
            options
          );
          res.send(result);
        }
      }
    });
    app.put("/subscribedteachersSub/:id", async (req, res) => {
      const [userEmail, userType] = req.params.id.split("***");
      const requestedbody = req.body;
      const filter = { email: userEmail };
      const options = { upsert: true };
      const query = { email: userEmail };
      const UserData = await studentCollection.findOne(query, {});

      if (userType == 1) {
        if (UserData.subscribedTeachers) {
          const filtered = UserData.subscribedTeachers.filter(
            (u) => u != requestedbody.selectedId
          );
          const updatedPart = {
            $set: {
              subscribedTeachers: filtered,
            },
          };
          const result = await studentCollection.updateOne(
            filter,
            updatedPart,
            options
          );
          res.send(result);
        }
      }
    });
    app.get("/subscribedteachers/:id", async (req, res) => {
      const [userEmail, userType] = req.params.id.split("***");
      // console.log("userEmail ", userEmail, "userType", userType);
      if (userType == 1) {
        // console.log("entered");
        const query = { email: userEmail };
        const result = await studentCollection.findOne(query, {});
        const allData = [
          {
            id: 1,
            name: "Md. Ebrahim Hossain",
            designation: "Assistant Professor",
            teacherCode: "",
            photoURL:
              "https://www.lus.ac.bd/wp-content/uploads/2020/01/Ebrahim-Hossain.jpg",
            courses: [
              "Computer Network",
              "Data Communication",
              "Digital Signal Processing",
              "Computer Security and Cryptography",
              "Distributed System",
              "System Analysis and Design",
              "Computer Graphics and Image processing",
              "Operating System Lab",
              "C programming Lab",
              "Computer Graphics Lab",
              "Computer Network Lab",
            ],
          },
          {
            id: 2,
            name: "Adil Ahmed Chowdhury",
            designation: "Lecturer",
            teacherCode: "",
            photoURL:
              "https://www.lus.ac.bd/wp-content/uploads/2020/07/adil-png.png",
            courses: [
              "Java Programming (Theory & Sessional)",
              "Cellular Mobile And Satellite Communication",
              "Discrete Mathematics",
              "Theory of Computation",
              "Data Communication",
              "Database Management System (Theory & Sessional)",
              "Computer Security and Cryptography",
              "Object-Oriented Programming (Theory & Sessional)",
              "Compiler Design and Construction (Theory & Sessional)",
              "Numerical Methods (Sessional)",
              "Introduction to Computing Sessional(Python)",
              "Structured Programming",
            ],
          },
          {
            id: 3,
            name: "Md. Jamaner Rahaman",
            designation: "Lecturer",
            teacherCode: "",
            photoURL:
              "https://www.lus.ac.bd/wp-content/uploads/2021/02/Capture.png",
            courses: [
              "Structured Programming (C)",
              "Object-oriented programming (Java)",
              "Introduction to Computers (Python)",
              "Artificial Intelligence",
              "Digital Signal Processing",
              "Database Management System",
              "Microprocessor, Assembly Language and Computer Interfacing",
              "Theory of Computation",
              "Engineering Drawing",
            ],
          },
          {
            id: 4,
            name: "Kazi Md. Jahid Hasan",
            designation: "Assistant Professor(Mathematics)",
            teacherCode: "",
            photoURL:
              "https://www.lus.ac.bd/wp-content/uploads/2020/06/jahid-1-scaled.jpg",
            courses: [
              "Differential and Integral Calculus",
              "Differential Equation and Fourier Analysis",
              "Coordinate Geometry and Vector Analysis",
              "Linear Algebra and Complex Analysis",
              "Laplace Transform",
            ],
          },
          {
            id: 5,
            name: "Arafat Habib Quraishi",
            designation: "Lecturer",
            teacherCode: "",
            photoURL:
              "https://www.lus.ac.bd/wp-content/uploads/2022/02/217A8685-scaled.jpg",
            courses: [
              "Computer Programming",
              "Data Structures",
              "Object Oriented Programming",
              "Database Management System",
              "Discrete Mathematics",
              "Computer Networks",
              "Computer Architecture and Design",
              "Software Engineering and Information System Design",
              "Digital Electronics",
              "Management Information System",
              "Data Warehousing and Data Mining",
              "Introduction to Computers",
              "Internet and E-Commerce",
            ],
          },
          {
            id: 6,
            name: "Sabia Akter Bhuiyan",
            designation: "Assistant Professor",
            teacherCode: "",
            photoURL:
              "https://www.lus.ac.bd/wp-content/uploads/2019/11/sabia_akter.jpg",
            courses: [
              "Differential and Integral Calculus",
              "Differential Equation and Fourier Analysis",
              "Coordinate Geometry and Vector Analysis",
              "Linear Algebra and Complex Analysis",
              "Laplace Transform",
              "Business Mathematics",
              "Probability and Statistics",
              "Discrete Mathematics",
            ],
          },
          {
            id: 7,
            name: "Rana M Luthfur Rahman Pir",
            designation: "Assistant Professor Proctor (Acting), LU",
            teacherCode: "",
            photoURL:
              "https://www.lus.ac.bd/wp-content/uploads/2022/03/465386_10150677640915709_891318216_o.jpg",
            courses: [
              "Computer Architecture and Design",
              "Computer Networks",
              "Data Warehousing and Data Mining",
              "Computer Security and Cryptography",
              "Management Information System",
              "System Analysis and Design",
              "Computer Peripherals and Interfacing",
              "Software Engineering",
              "Advanced Software Engineering",
              "Human-Computer Interaction",
              "Computer Peripherals and Interfacing",
              "Data Communication",
            ],
          },
          {
            id: 8,
            name: "Prof. Dr. AS. Sikder",
            designation: "Professor",
            teacherCode: "",
            photoURL:
              "https://www.lus.ac.bd/wp-content/uploads/2022/11/pic.jpg",
            courses: [
              "Software Engineering",
              "System Analysis & Design",
              "Database Management System",
              "Advanced Computer Networks",
              "Advanced Operating System",
              "Cryptography & Network Security",
              "Cyber Security & Ethical Hacking",
              "Information Systems Security",
              "Cloud Computing",
              "Advanced Algorithms",
              "Neural Network & Fuzzy Logic",
              "Machine Learning",
              "Big Data & Data Mining",
              "Data Analytics",
              "Business Analytics",
              "Management Information System",
            ],
          },
          {
            id: 9,
            name: "Syeda Tamanna Alam Monisha",
            designation: "Lecturer",
            teacherCode: "",
            photoURL:
              "https://www.lus.ac.bd/wp-content/uploads/2019/11/Syeda-Tajmanna-Alam-Monisha.jpg",
            courses: [
              "Computer Security and Cryptography",
              "Compiler Design and Construction",
              "Digital Signal Processing",
              "Artificial Intelligence",
              "Numerical Methods",
              "Data Communication",
              "Database Management System",
              "Object-Oriented Programming",
              "Data Structure",
              "Discrete Mathematics",
            ],
          },
        ];
        if (result.subscribedTeachers) {
          const subscribedTeachers = result.subscribedTeachers;
          const filteredData = allData.filter((obj) =>
            subscribedTeachers.includes(obj.id)
          );
          const notFilteredData = allData.filter(
            (obj) => !subscribedTeachers.includes(obj.id)
          );
          const finalData = {
            subscribed: filteredData,
            notsubscribed: notFilteredData,
          };
          res.send(finalData);
        } else {
          const finalData = {
            subscribed: [],
            notsubscribed: allData,
          };
          res.send(finalData);
        }
      } else {
        res.send({ status: "Not applicable" });
      }
    });

    //  Api for updating the bio

    app.put("/profilebio", async (req, res) => {
      const requestedbody = req.body;
      const filter = { email: requestedbody.profileData.email };
      const options = { upsert: true };
      if (requestedbody.profileData.userType === 1) {
        const updatedBioPart = {
          $set: {
            bio: requestedbody.bio,
          },
        };
        const result = await studentCollection.updateOne(
          filter,
          updatedBioPart,
          options
        );
        res.send(result);
      } else {
        const updatedBioPart = {
          $set: {
            bio: requestedbody.bio,
          },
        };
        const result = await teacherCollection.updateOne(
          filter,
          updatedBioPart,
          options
        );
        res.send(result);
      }
    });
    // Api for updating users profile and cover pictures

    app.put("/profileupdate", async (req, res) => {
      const { name, address, phoneNumber, userType, email } = req.body;

      const options = { upsert: true };
      const filter = { email: email };
      if (userType === 1) {
        const updatedPart = {
          $set: {
            name: name,
            address: address,
            phoneNumber: phoneNumber,
          },
        };
        const result = await studentCollection.updateOne(
          filter,
          updatedPart,
          options
        );
        res.send(result);
        console.log(result);
      } else {
        const updatedPart = {
          $set: {
            name: name,
            address: address,
            phoneNumber: phoneNumber,
            designation: req.body.designation,
          },
        };
        const result = await teacherCollection.updateOne(
          filter,
          updatedPart,
          options
        );
        res.send(result);
        console.log(result);
      }
    });
    // ============ Profile Pic Modify Api
    app.put("/profilepic/modify", async (req, res) => {
      const requestedbody = req.body;
      console.log("profile pic api hit", requestedbody);
      const filter = { email: requestedbody.profileData.email };
      const options = { upsert: true };
      if (requestedbody.profileData.userType === 1) {
        const foundUser = await studentCollection.findOne(filter, {});
        const updatedPart = {
          $set: {
            profileImgLink: requestedbody.profileImgLink,
          },
        };
        const result = await studentCollection.updateOne(
          filter,
          updatedPart,
          options
        );
        res.send(result);
        console.log(result);
      } else {
        const foundUser = await teacherCollection.findOne(filter, {});
        const updatedPart = {
          $set: {
            profileImgLink: requestedbody.profileImgLink,
          },
        };
        const result = await teacherCollection.updateOne(
          filter,
          updatedPart,
          options
        );
        res.send(result);
        console.log(result);
      }
    });
    // ============= Cover Pic Modify Api
    app.put("/coverpic/modify", async (req, res) => {
      const requestedbody = req.body;
      console.log("cover pic api hit", requestedbody);
      const filter = { email: requestedbody.profileData.email };
      const options = { upsert: true };
      if (requestedbody.profileData.userType === 1) {
        const foundUser = await studentCollection.findOne(filter, {});
        const updatedPart = {
          $set: {
            coverImgLink: requestedbody.coverImgLink,
          },
        };
        const result = await studentCollection.updateOne(
          filter,
          updatedPart,
          options
        );
        res.send(result);
        console.log(result);
      } else {
        const foundUser = await teacherCollection.findOne(filter, {});
        const updatedPart = {
          $set: {
            coverImgLink: requestedbody.coverImgLink,
          },
        };
        const result = await teacherCollection.updateOne(
          filter,
          updatedPart,
          options
        );
        res.send(result);
        console.log(result);
      }
    });
    // admin panel stat provider api ======================== ++++++++++++++++++++++++++++

    app.get("/showstats", async (req, res) => {
      const query = {};
      const reportedCursor = reportedPostCollection.find(query);
      const reportedPosts = await reportedCursor.toArray();

      const transportationCursor = transportCollection.find(query);
      const transportationPosts = await transportationCursor.toArray();

      const generalPostCursor = GeneralPostCollection.find(query);
      const generalPosts = await generalPostCursor.toArray();
      const selectedUniPostCursor =
        selectedPostUniversityCollection.find(query);
      const selectedDeptPostCursor =
        selectedPostDepartmentCollection.find(query);
      const selectedTeacherPostCursor =
        selectedPostTeacherCollection.find(query);
      const selectedUniPosts = await selectedUniPostCursor.toArray();
      const selectedDeptPosts = await selectedDeptPostCursor.toArray();
      const selectedTeacherPosts = await selectedTeacherPostCursor.toArray();
      const studentCursor = studentCollection.find(query);
      const teacherCursor = teacherCollection.find(query);
      const students = await studentCursor.toArray();
      const teachers = await teacherCursor.toArray();
      const data = [
        {
          students: students.length,
          teachers: teachers.length,
        },
        [
          {
            title: "General Posts",
            data: generalPosts,
            id: 1,
            length: generalPosts.length,
          },
          {
            title: "Reported Posts",
            data: reportedPosts,
            id: 2,
            length: reportedPosts.length,
          },
          {
            title: "Transportation Posts",
            data: transportationPosts,
            id: 3,
            length: transportationPosts.length,
          },
          {
            title: "University Specific Posts",
            data: selectedUniPosts,
            id: 4,
            length: selectedUniPosts.length,
          },
          {
            title: "Teacher's Specific Posts",
            data: selectedTeacherPosts,
            id: 5,
            length: selectedTeacherPosts.length,
          },
          {
            title: "Department Specific Posts",
            data: selectedDeptPosts,
            id: 6,
            length: selectedDeptPosts.length,
          },
        ],
      ];

      res.send(data);
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
