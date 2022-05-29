import { Client } from 'faunadb';

export const fauna = new Client({
  secret: process.env.FAUNADB_ADMIN_KEY,

  domain: "db.us.fauna.com",
})