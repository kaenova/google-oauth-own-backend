import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;
import randomwords from 'random-words'
import { OAuth2Client } from "google-auth-library"
import { backendJWTSecret, googleClientID } from "./constant.js";
import { emailExist, newUser } from "./db.js";

const gClient = new OAuth2Client(googleClientID);

export async function ping(req, res) {
  res.send('Hello World!')
  return
}

export async function secret(req, res) {
  // Check jwt on authorization
  const authHeader = req.get('Authorization')
  console.log(authHeader)
  if (typeof authHeader == 'undefined') {
    res.status(401)
    return
  }
  const splitAuth = authHeader.split(" ")
  if (splitAuth.length != 2) {
    res.status(401)
    return
  }
  const jwtReq = splitAuth[1]

  // Verify JWT
  try {
    verify(jwtReq, backendJWTSecret)
  } catch (e) {
    res.status(401)
    return
  }

  const data = randomwords()
  console.log(data)
  res.send(data)
  return
}

export async function googleAuth(req, res) {
  try {
    // Get 'credential' data from request
    const data = { ...req.body }

    if (typeof data['credential'] == 'undefined') {
      res.status(400)
      return
    }

    // Verifying to google
    const ticket = await gClient.verifyIdToken({
      idToken: data['credential'],
      audience: googleClientID
    });

    // Get User's data
    const userData = ticket.getPayload()
    const email = userData['email']

    // Check if email is registered in our database
    const exist = await emailExist(email)
    if (!exist) {
      console.log(`info: creating new user as ${email}`)
      await newUser(email)
      console.log(`info: new user created as ${email}`)
    }

    const token = sign({
      email: email
    }, backendJWTSecret, { expiresIn: "1 day" })

    const finalData = {
      "jwt": token,
      "first_time_sign_in": !exist
    }

    res.json(finalData)
    return
  } catch (e) {
    console.log("erorr: 500 google auth", e)
    res.status(500)
    return
  }
}