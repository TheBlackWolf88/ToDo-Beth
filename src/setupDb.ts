import { createClient } from "@libsql/client";
import 'dotenv/config'

const client = createClient({
    url: process.env.DB_URL,
    authToken: process.env.DB_TOKEN
})

let bs = await client.execute("create table todos (id text primary key, name text, isComplete integer);")
