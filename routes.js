import Express from "express";

import {

  verifytoken,
} from "./helperfunctions.js";
import {
  blogtoget,
  deleteblog,
  
} from "./mongodb.js";
import {  filter, login, post, signup, toDelete, update } from "./blogcontrollers.js";
const router = Express.Router();

//endpoint for user sign up
router.post("/signup", signup);

//endpoint for user login
router.post("/login",login)

//endpoint to filter blogs by category and author
router.get("/blogs",filter);

//endpoint to post blogs
router.post("/postblog",post);


//endpoint to update the blog
router.put("/updateblog/:id",update);

//endpoint to delete blog after validation
router.delete("/deleteblog/:id",toDelete);

const userRouter = router;
export default userRouter;

//endpoint to get all blogs after jwt verification
//router.get("/blogs",blog);



/*router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Validation for empty fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //check for existing user
    const existinguser = await checkuser(email);
    if (existinguser) {
      return res.status(400).json({ message: "user already exists" });
    }
    //encrypting password
    const hashedpassword = await hassing(password);
    const user = { name, email, hashedpassword, createdAt: new Date() };
    await createUser(user);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});*/
/*router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation for empty fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //check for user
    const existinguser = await checkuser(email);
    if (!existinguser) {
      return res.status(400).json({ message: "user not found" });
    }
    //check for password
    const checkpassword = await comparepassword(password, existinguser);
    if (!checkpassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //generate jwt token
    const toekn = await jwttoken(existinguser);

    console.log("token", toekn);

    res
      .status(200)
      .json({ message: "login successful", token: toekn, user: existinguser });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});*/
/*router.get("/blogs", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    const decodethetoken = await verifytoken(token);
    console.log("decodethetoken", decodethetoken);
    if (!decodethetoken) {
      return res.status(401).json({ message: "unauthorized user" });
    }

    const getblogs = await blogs();

    if (!getblogs) {
      res.status(404).json({ message: "no blogs found" });
    }
    res.status(200).json(getblogs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error", err });
  }
});*/

/*router.get("/blogs", async (req, res) => {
  try {
    const { category, author } = req.query;

    console.log("category", category, "author", author);
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    const decodethetoken = await verifytoken(token);
    if (!decodethetoken) {
      return res.status(401).json({ message: "unauthorized user" });
    }
   const filterblogs = {};
    if (category) {
      filterblogs.category = { $regex: new RegExp(`^${category}$`, "i") }; // exact match, case-insensitive
    }
    if (author) {
      filterblogs.author = { $regex: new RegExp(`^${author}$`, "i") };
    }
    console.log("filterblogs", filterblogs);

    const getblogs = await filteredblogs(filterblogs);
    if (!getblogs || getblogs.length === 0) {
      return res.status(404).json({ message: "no blogs found" });
    }
    res.status(200).json(getblogs);
  } catch (err) {
    res.status(500).json({ message: "internal server error", err });
  }
});*/
/*router.post("/postblog", async (req, res) => {
  const { title, category, author, content ,id} = req.body;

  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    const decodethetoken = await verifytoken(token);
    if (!decodethetoken) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    if ((!title, !category, !author, !content)) {
      return res.status(400).json({ message: "all fields are reuired" });
    }
    const newpost = {
      title: title,
      category: category,
      author: author,
      content: content,
      userId: new ObjectId(id),
      createdAt: new Date(),
    };
    await postblog(newpost);
    res.status(200).json({ message: "blog posted succesfully", newpost });
  } catch (err) {
    return res.status(500).json({ message: "internal server erroe", err });
  }
});*/

/*router.put("/updateblog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, author,content,userid} = req.body;
    console.log("userid",userid);
    if ((!title, !category, !author, !content)) {
      return res.status(400).json({ message: "all fields are reuired" });
    }
    const updatedblog = {
      title: title,
      category: category,
      author:author,
      content: content,
      updatedAt: new Date(),
    };
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    const decodethetoken = await verifytoken(token);
    console.log("decodethetoken", decodethetoken);
    if (!decodethetoken) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    const getblogforupdate = await blogtoget(id);
    console.log("getblogforupdate", getblogforupdate);
    if (!getblogforupdate) {
      return res.status((404).json({ message: "Blog not found" }));
    }
    if (getblogforupdate.userId != userid) {
      return res.status(401).json({ message: "unauthorized user" });
    }
      await updateblog(id, updatedblog);
      res.status(200).json({"message":"blog updated successfully",updatedblog});  
    
  } catch (err) {
    return res.status(500).json({ message: "internal server error", err });
  }
});*/
/*router.delete("/deleteblog/:id", async (req, res) => {
  try {
    const {userid} = req.body;
    console.log("userid",userid);
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    const decodethetoken = await verifytoken(token);
    if (!decodethetoken) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    const { id } = req.params;
    console.log(id);

    const getblogfordelte = await blogtoget(id);
    console.log("getblogfordelte", getblogfordelte);
    if (!getblogfordelte) {
      return res.status(404).json({ message: "blog not found" });
    }
    if (getblogfordelte.userId != userid) {
      return res.status(401).json({ message: "unauthorized user" });
    }

    await deleteblog(id);
    res.status(200).json({ message: "blog deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error", err });
  }
});*/ 