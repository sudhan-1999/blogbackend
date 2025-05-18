import { ObjectId } from "mongodb";
import { client } from "./index.js";

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
  filteredblogs,
  findBlogsByUser,
  postblog,
  updateblog,
} from "./mongodb.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existinguser = await checkuser(email);
    if (existinguser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hassing(password);

    const user = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await createUser(user);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
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
      return res.status(404).json({ message: "user not found" });
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

//
export const myblogs = async (req, res) => {
  try {
    const { userid } = req.query;
    if (!userid) {
      return res.status(400).json({ message: "userid is required" });
    }

    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const decoded = await verifytoken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const blogs = await findBlogsByUser(userid);

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });
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
    const { title, category, author, content, userId } = req.body;

    if (!title || !category || !author || !content)
      return res.status(400).json({ message: "all fields are required" });

    // token check (unchanged)
    let token = req.headers.authorization || "";
    if (token.startsWith("Bearer ")) token = token.split(" ")[1];
    if (!token) return res.status(401).json({ message: "unauthorized user" });
    const decoded = await verifytoken(token);
    if (!decoded) return res.status(401).json({ message: "unauthorized user" });

    // find blog
    const blog = await blogtoget(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // ownership check against userId from request body
    if (blog.userId.toString() !== userId)
      return res.status(403).json({ message: "Forbidden: Not blog owner" });

    // update
    const updated = {
      title,
      category,
      author,
      content,
      updatedAt: new Date(),
    };
    await updateblog(id, updated);

    res.status(200).json({ message: "blog updated successfully", updated });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const toDelete = async (req, res) => {
  try {
    let token = req.headers.authorization || "";
    if (token.startsWith("Bearer ")) token = token.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized user" });

    const decoded = await verifytoken(token);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    const { id } = req.params;
    const userIdFromQuery = req.query.userid;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid blog ID" });

    const blog = await blogtoget(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.userId.toString() !== userIdFromQuery) {
      return res.status(403).json({ message: "Forbidden: Not blog owner" });
    }

    const result = await client
      .db("Blog")
      .collection("blogs")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(500).json({ message: "Failed to delete blog" });
    }

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
