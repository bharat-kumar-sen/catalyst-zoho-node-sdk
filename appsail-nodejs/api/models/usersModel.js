// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var Any = mongoose.Schema.Types.Mixed;
// // Define collection and schema for Items

// var Users = new Schema({
//   profileImage: {
//     type: String,
//     // trim: true
//   },
//   firstName: {
//     type: String,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     trim: true
//   },
//   email: {
//     type: String,
//     trim: true,
//     unique: true
//   },
//   phoneNumber: {
//     type: String
//   },
//   password: {
//     type: String
//   },
//   gender: {
//     type: String
//   },
//   dob: {
//     type: String
//   },
//   role: {
//     type: String
//   },
//   status: {
//     type: Number
//   },
//   profileImage: Any,
//   forgotLink: String,
//   forgotStatus: Any,
// }, {
//   timestamps: true,
//   collection: 'users'
// });

// module.exports = mongoose.model('users', Users);