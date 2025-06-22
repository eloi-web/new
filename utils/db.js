const mongoose = require('mongoose');

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}
let cached = global.mongoose;

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
