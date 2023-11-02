var jwt = require("jsonwebtoken");
var catalyst = require('zcatalyst-sdk-node');
require("dotenv").config();
const crypto = require('crypto');


exports.saveUserInfo = async (req, res) => {
  const postData = req.body;

  if (postData.password) {
    postData.password = this.encryptString(postData.password);
  } else {
    delete postData.password;
  }  
  var Usertbl = await this.catalystZohoTableConfig(req, 'users');
  let rowPromise
  if(postData.ROWID) {
     rowPromise = Usertbl.updateRow(postData)    
  } else {
     rowPromise = Usertbl.insertRow(postData);
  }
  rowPromise.then((row) => {
    return res.status(200).json({
      message: "User Details saved successfully.",
      status:200,
      data: row,
    })
		// res.redirect(req.get('referer')); //Reloads the page again after a successful insert
	}).catch(err => {
    return res.status(500).json({
      message: "There are some error while save user.",
      status: 500,
      data: err,
    })
	});
};

exports.doSignIn = async (req, res) => {
  // console.log(" process.env.JWT_SECRETKEY=========",  process.env.JWT_SECRETKEY);
  var CatalystApp = catalyst.initialize(req);
  const postData = req.body;
  postData.email = postData.email.toLowerCase();
  postData.password = this.encryptString(postData.password);
  if (postData.email) {
    delete postData.remember;
    try {
     
      let query = "SELECT * from users WHERE email='"+postData.email+"' AND password='"+postData.password+"'";
      let userDetails = await  CatalystApp.zcql().executeZCQLQuery(query);
      // userDetails = userDetails.map((item) => item.users);
      if (userDetails && userDetails.length) {
        userDetails = userDetails[0].users
        userDetails._id = userDetails.ROWID;
        var token = jwt.sign(
          {
            _id: userDetails._id,
          },
          process.env.JWT_SECRETKEY,
          {
            expiresIn: process.env.TOKEN_EXPIRE, // expires in 24 hours 1h, 5m, "10h", "7d"
          }
        );
        // console.log("process.env.TOKEN_EXPIRE======", process.env.TOKEN_EXPIRE)
        userDetails = JSON.parse(JSON.stringify(userDetails));
        userDetails.authorization = token;
        req.session.currentUser = userDetails;
        delete userDetails.password;
        return res.json({
          message: "You have signin successfully!",
          status: 200,
          data: userDetails,
        });
      } else {
        return res.status(400).json({
          message: "Please provide valid email or password.",
          status: 400,
        });
      }
    } catch (error) {
      console.log("error=======", error);
      return res.status(500).json({
        message: "Please provide valid email or password.",
        status: 500,
        error: error,
      });
    }
  }
  {
    return res.status(400).json({
      message: "Please provide valid email or password.",
      status: 400,
    });
  }
};

exports.getUsersList = async (req, res) => {
	var Usertbl = await this.catalystZohoTableConfig(req, 'users');
  try {
    let userDetails = await Usertbl.getPagedRows({ maxRows: 100 }) 
    return res.status(200).json({
      status: 200,
      message: "Get the user list successfully.",
      data: userDetails.data,
      totalRecord: userDetails.data.length
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Some error occrred.",
      data: error,
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  return res.status(200).json({
    status: 200,
    message: "Logged out successfully.",
  });
};

exports.deleteUser = async (req, res) => {
  // const ROWID = req.params.id;
  const ROWID = req.body.ROWID;
	var Usertbl = await this.catalystZohoTableConfig(req, 'users');
	let rowPromise = Usertbl.deleteRow(ROWID);
	rowPromise.then((row) => {
    return res.status(200).json({
      message: "User Delete Successfully.",
      status: 200,
    });
	}).catch(err => {
		console.log(err);
    return res.status(500).json({
      message: "there are some error while deleting users.",
      status: 500,
      data: err
    });
	});
};

exports.catalystZohoTableConfig = async (req, tableName) => {
  var catalystApp =  catalyst.initialize(req);
	var datastore =  catalystApp.datastore();
	var table = datastore.table(tableName);
  return table
};

exports.encryptString = (text) => {
  let encryptedData = crypto.createHash("md5").update(text).digest("hex");
  return encryptedData;
};