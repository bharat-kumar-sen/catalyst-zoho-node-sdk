const User = require("../models/usersModel.js");
const globalService = require("../core/globalService");
var jwt = require("jsonwebtoken");
const asyncLib = require("async");
var catalyst = require('zcatalyst-sdk-node');

require("dotenv").config();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const catalystFolderId = '5261000000021007'
const catalstProjectId = '5261000000007197'
exports.saveUserInfo = async (req, res) => {
  const postData = req.body;

  if (postData.password) {
    postData.password = globalService.encryptString(postData.password);
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

exports.uploadfileWithUser = async (req, res)=> {
  let postData = req.body;
  try {
    if(req.files) {
      console.log("req.files======", req.files);
      const app = catalyst.initialize(req);
      req.files.image.name = Date.now() + "-" + req.files.image.name
      await req.files.image.mv(`/tmp/${req.files.image.name}`);
      var fileRes = await app.filestore().folder(catalystFolderId).uploadFile({
        code: fs.createReadStream(`/tmp/${req.files.image.name}`),
        name: req.files.image.name
      });
      postData.profile_details=  JSON.stringify({
        imgUrl: "https://console.catalyst.zoho.in/baas/v1/project/"+catalstProjectId+"/folder/"+catalystFolderId+"/file/"+ fileRes.id +"/download",
        file_id:  fileRes.id,
        file_name: fileRes.file_name
      })
      // postData.profile_url =   "https://console.catalyst.zoho.in/baas/v1/project/"+catalstProjectId+"/folder/"+catalystFolderId+"/file/"+ fileRes.id +"/download"
    } 
    if (postData.password) {
      postData.password = globalService.encryptString(postData.password);
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
      console.log("err--------", err);
      return res.status(500).json({
        message: "There are some error while save user.",
        status: 500,
        data: err,
      })
    });
	} catch (error) {
    console.log("error--------", error);
		res.status(500).send({
			"status": "Internal Server Error",
			"message": error
		})
	}
//   var app = catalyst.initialize(req);
//   let filestore = app.filestore();
//   let folder = filestore.folder('5261000000018071');
//   const stream = Readable.from(req.file.buffer);
//   var data = {
//       code: stream,
//       name: req.file.originalname
//   };
//   console.log(data);
//   var result = await folder.uploadFile(data);
//   return res.status(200).json(successResponse(result));
//  //Provide the Folder ID 
//  let config = { code:fs.createReadStream('empdata.csv'), name: 'testFile.txt' };
// let uploadPromise = folder.uploadFile(config); 
// //Pass the JSON object created for the file 
//   uploadPromise.then((fileObject) => {
//     console.log('testt=====', fileObject); 
//   });
}

exports.doSignIn = async (req, res) => {
  var CatalystApp = catalyst.initialize(req);
  const postData = req.body;
  postData.email = postData.email.toLowerCase();
  postData.password = globalService.encryptString(postData.password);
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
        userDetails.profile_details =  JSON.parse(userDetails.profile_details )
        userDetails.profileImage = userDetails.profile_details.imgUrl;
        req.session.currentUser = userDetails;
        delete userDetails.password;
        return res.json({
          message: "You have signin successfully!",
          status: 200,
          data: userDetails,
        });
      } else {
        return res.json({
          message: "Please provide valid email or password.",
          status: 400,
        });
      }
    } catch (error) {
      console.log("error=======", error);
      return res.json({
        message: "Please provide valid email or password.",
        status: 500,
        error: error,
      });
    }
  }
  {
    return res.json({
      message: "Please provide valid email or password.",
      status: 400,
    });
  }
};

exports.getUsersList = async (req, res) => {
	var Usertbl = await this.catalystZohoTableConfig(req, 'users');
  try {
    let userDetails = await Usertbl.getPagedRows({ maxRows: 100 }) 
    userDetails.data.map( (element)=> {
      if(element.profile_details){
        element.profile_details = JSON.parse(element.profile_details);
        element.image = element.profile_details.imgUrl
      }
    })
    return res.json({
      status: 200,
      message: "Get the user list successfully.",
      data: userDetails.data,
      totalRecord: userDetails.data.length
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Some error occrred.",
      data: error,
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  return res.json({
    status: 200,
    message: "Logged out successfully.",
  });
};

exports.getUserInfo = async (req, res) => {
  var whereObj = req.body;
  if (whereObj.forgotLink && whereObj._id) {
    whereObj.forgotStatus = 1;
    try {
      let userDetails = await User.findOne(whereObj);
      if (userDetails) {
        let checkLinkExireTime = globalService.linkExpiryTimeCheck(
          userDetails.updatedAt
        ); // HERE WE ARE CHECKING LINK TIME EXPIRATION.
        if (checkLinkExireTime) {
          return res.json({
            message: "Get the user info successfully.",
            status: 200,
            data: userDetails,
          });
        } else {
          return res.json(globalService.linkExpiryError());
        }
      } else {
        return res.json(globalService.linkExpiryError());
      }
    } catch (error) {
      return res.json(globalService.linkExpiryError());
    }
  } else {
    return res.json(globalService.linkExpiryError());
  }
};

exports.deleteUser = async (req, res) => {
  const ROWID = req.params.id;
	var Usertbl = await this.catalystZohoTableConfig(req, 'users');
	let rowPromise = Usertbl.deleteRow(ROWID);
	rowPromise.then((row) => {
    return res.json({
      message: "User Delete Successfully.",
      status: 200,
    });
	}).catch(err => {
		console.log(err);
    return res.json({
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

