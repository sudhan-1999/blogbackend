import Express from "express";
import {  filter, login, myblogs, post, signup, toDelete, update } from "./blogcontrollers.js";
const router = Express.Router();

//endpoint for user sign up
router.post("/signup", signup);

//endpoint for user login
router.post("/login",login)

//endpoint to filter blogs by category and author and retrive all blogs used for both
router.get("/blogs",filter);
//to get blogs posted by user
router.get("/myblogs", myblogs); 

//endpoint to post blogs
router.post("/postblog",post);


//endpoint to update the blog
router.put("/updateblog/:id",update);

//endpoint to delete blog after validation
router.delete("/deleteblog/:id", toDelete);

const userRouter = router;
export default userRouter;


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