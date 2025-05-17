import { ObjectId } from "mongodb";
import { client } from "./index.js";

//to create a new user
export async function createUser(user) {
  try {
    return await client.db("Blog").collection("user").insertOne(user);
  } catch (err) {
    return err;
  }
}
//to check existing user
export async function checkuser(email) {
  try {
    return await client.db("Blog").collection("user").findOne({ email });
  } catch (error) {
    return error;
  }
}
//to filter blogs
export async function filteredblogs(filterblogs) {
  try {
     const res= await client
      .db("Blog")
      .collection("blogs")
      .find(filterblogs)
      .toArray();
      console.log("res", res);
      return res
  } catch (err) {
    return err;
  }
}

//to insert new blogs
export async function postblog(newpost) {
  try {
    return await client.db("Blog").collection("blogs").insertOne(newpost);
  } catch (err) {
    return err;
  }
}

//to get blog by id
export async function blogtoget(id) {
  try {
    const objectId = new ObjectId(id);
    return await client
      .db("Blog")
      .collection("blogs")
      .findOne({ _id: objectId });
  } catch (err) {
    return err;
  }
}


//to delete blog by id
export async function deleteblog(id) {
  try {
    const objectId = new ObjectId(id);
    return await client
      .db("Blog")
      .collection("blogs")
      .deleteOne({ _id: objectId });
  } catch (err) {
    return err;
  }
}

//to update blog by id
export async function updateblog(id,updatedblog){
  try{
    return await client.db("Blog").collection("blogs").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedblog }
    );
  }catch(err){
    return err;
  }
}
