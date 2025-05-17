import { ObjectId } from "mongodb";
import {
  comparepassword,
  hassing,
  jwttoken,
  verifytoken,
} from "./helperfunctions.js";
import {
  blogtoget,
  checkuser,
  createUser,
  deleteblog,
  filteredblogs,
  postblog,
  updateblog,
} from "./mongodb.js";

export const signup = async (req, res) => {
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
    //user object
    const user = { name, email, hashedpassword, createdAt: new Date() };
    //inserting user into DB
    await createUser(user);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
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
    res
      .status(200)
      .json({ message: "login successful", token: toekn, user: existinguser });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const filter = async (req, res) => {
  try {
    const { category, author } = req.query;
    const token = req.headers["authorization"];
    //token validation
    if (!token) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    const decodethetoken = await verifytoken(token);
    if (!decodethetoken) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    //blog filter
    const filterblogs = {};
    if (category) {
      filterblogs.category = { $regex: category, $options: "i" };
    }
    if (author) {
      filterblogs.author = { $regex: author, $options: "i" };
    }
   //getting blogs by filtering
    const getblogs = await filteredblogs(filterblogs);
    if (!getblogs || getblogs.length === 0) {
      return res.status(404).json({ message: "no blogs found" });
    }
    res.status(200).json(getblogs);
  } catch (err) {
    res.status(500).json({ message: "internal server error", err });
  }
};

export const post = async (req, res) => {
  try {
    //input validation
    const { title, category, author, content, id } = req.body;
    if ((!title, !category, !author, !content)) {
      return res.status(400).json({ message: "all fields are reuired" });
    }
    //token validation
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    const decodethetoken = await verifytoken(token);
    if (!decodethetoken) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    //new post object
    const newpost = {
      title: title,
      category: category,
      author: author,
      content: content,
      userId: new ObjectId(id),
      createdAt: new Date(),
    };
    //inserting postin DB
    await postblog(newpost);
    res.status(200).json({ message: "blog posted succesfully", newpost });
  } catch (err) {
    return res.status(500).json({ message: "internal server erroe", err });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    //input validation
    const { title, category, author, content, userId } = req.body;
    console.log("userid", userId);
    if ((!title, !category, !author, !content)) {
      return res.status(400).json({ message: "all fields are reuired" });
    }
    //updated blog object
    const updatedblog = {
      title: title,
      category: category,
      author: author,
      content: content,
      updatedAt: new Date(),
    };
    //token validation
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    const decodethetoken = await verifytoken(token);
    console.log("decodethetoken", decodethetoken);
    if (!decodethetoken) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    //getting blog by id
    const getblogforupdate = await blogtoget(id);
    console.log("getblogforupdate", getblogforupdate);
    if (!getblogforupdate) {
      return res.status((404).json({ message: "Blog not found" }));
    }
    if (getblogforupdate.userId != userid) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    //updating blog in Db
    await updateblog(id, updatedblog);
    res.status(200).json({ message: "blog updated successfully", updatedblog });
  } catch (err) {
    return res.status(500).json({ message: "internal server error", err });
  }
};

export const toDelete = async (req, res) => {
  try {
    const { userid } = req.body;
    //token validation
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    const decodethetoken = await verifytoken(token);
    if (!decodethetoken) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    //getting blog by id
    const { id } = req.params;
    const getblogfordelte = await blogtoget(id);
    if (!getblogfordelte) {
      return res.status(404).json({ message: "blog not found" });
    }
    if (getblogfordelte.userId != userid) {
      return res.status(401).json({ message: "unauthorized user" });
    }
    //deleting blog from Db
    await deleteblog(id);
    res.status(200).json({ message: "blog deleted" });
  } catch (err) {
    return res.status(500).json({ message: "internal server error", err });
  }
};
