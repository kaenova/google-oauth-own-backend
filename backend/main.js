import express from 'express'
import cors from 'cors'
import { googleAuth, ping, secret } from './controller.js'
import { port } from './constant.js'
import { initDatabase } from './db.js'

async function main() {
  await initDatabase()

  const app = express()

  // Adding middleware
  app.use(express.json())
  app.use(cors())

  // Hello world
  app.get('/__ping', ping)

  // To get the random string by also checking if it's valid jwt
  app.get("/secret", secret)

  // To get JWT of our own app by authenticating people using google services
  app.post("/auth/google", googleAuth)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

main()

