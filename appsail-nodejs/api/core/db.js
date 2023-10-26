const mongoose = require("mongoose");
exports.createDBConnection = () => {
  mongoose.Promise = global.Promise;
  const connect = mongoose.connect(
    // "mongodb+srv://bharat:EqnwUpI5RVJufWTy@cluster0.i3fkd.mongodb.net/angular-node-training?retryWrites=true&w=majority",
    process.env.DB_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  );
  return connect;
};