import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.jwt_secret;

export async function hassing(password) {
  try {
    const salt = await bcrypt.genSalt(10);//gnerating salt of 10 rounds
    const hassing = await bcrypt.hash(password, salt);//hassing the pass
    return hassing;
  } catch (err) {
    return err;
  }
}

export async function comparepassword(password, existinguser) {
  try {
    const isMatch = await bcrypt.compare(password, existinguser.hashedpassword);//comparing the pass
    return isMatch;
  } catch (err) {
    return err;
  }
}

export async function jwttoken(existinguser) {
  try {
    //generating the jwt 
    const token = jwt.sign(
      { email: existinguser.email, name: existinguser.name },
      jwtSecret,
      { expiresIn: "1h" }
    );
    return token;
  } catch (err) {
    return err;
  }
}

export async function verifytoken(token) {
  try {
    //jwt validation
    const decode = jwt.verify(token, jwtSecret);
    return decode;
  } catch (err) {
    return err;
  }
}


