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