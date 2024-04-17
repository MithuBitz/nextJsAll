import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  //If there is a connection is already in use with db
  if (connection.isConnected) {
    console.log("Database already connected");
    return;
  }

  //If no connection is present then start a connection
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    console.log(db);

    connection.isConnected = db.connections[0].readyState;
    console.log(db.connections);

    console.log("DB successfully connected");
  } catch (error) {
    console.log("Database connection failed");

    process.exit(1);
  }
}

export default dbConnect;
