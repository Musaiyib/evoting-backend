import mongoose from 'mongoose';

export class Database {
  constructor() {
    this.url = process.env.MONGO_URI;
  }
  async connect() {
    try {

      mongoose.connect(this.url, {
        autoIndex: true, useNewUrlParser: true, autoCreate: true
      })
      console.log("Connection to MongoDB cluster was successfully")
    } catch (error) {
      console.log("Error connecting to MongoDB")
      console.error(error)
    }

  }
}
