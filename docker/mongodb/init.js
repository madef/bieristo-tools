print("---- Running init script (JS) to create user ----");

db.auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD
);

db = db.getSiblingDB(process.env.MONGO_DBNAME);

db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    { role: 'dbOwner', db: process.env.MONGO_DBNAME }
  ]
});

print("---- User creation script (JS) completed ----");
