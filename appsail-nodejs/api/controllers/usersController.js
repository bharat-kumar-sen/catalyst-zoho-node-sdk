const User = require("../models/usersModel.js");
const globalService = require("../core/globalService");
var jwt = require("jsonwebtoken");
const asyncLib = require("async");
var catalyst = require('zcatalyst-sdk-node');

require("dotenv").config();

exports.saveUserInfo = async (req, res) => {
  const postData = req.body;
  if (postData.password) {
    postData.password = globalService.encryptString(postData.password);
  }

  if (postData._id) {
    postData.updatedAt = new Date();
    if (postData.profileOldImage) {
      globalService.removeFile(postData.profileOldImage, () => {});
    }
    User.updateOne(
      {
        _id: postData._id,
      },
      postData,
      (err, resp) => {
        if (err) {
          return res.json({
            status: 500,
            message: "There are some error while update.",
            data: err,
          });
        } else {
          if (!postData.password) {
            req.session.currentUser = postData;
          } else {
            req.session.destroy();
          }
          let checkPassword = postData.password;
          delete postData.password;
          return res.json({
            status: 200,
            message: checkPassword
              ? "Your password has been changed successfully."
              : "User Profile Updated successfully.",
            data: postData,
          });
        }
      }
    );
  } else {
    // postData.email = postData.email.toLowerCase();
    const addUser = new User();
    Object.keys(postData).forEach((key) => {
      addUser[key] = postData[key];
    });
    try {
      var userResp = await addUser.save();
      if (userResp) {
        return res.json({
          message: "User Account Created Successfuly.",
          status: 200,
          data: userResp,
        });
      } else {
        return res.json({
          message: "Failed to create account.",
          status: 500,
          error: "Getting issue while creating user account.",
        });
      }
    } catch (error) {
      return res.json({
        message: "Failed to create an user account.",
        status: 500,
        error: error.message,
      });
    }
  }
};

exports.doSignIn = async (req, res) => {
  var CatalystApp = catalyst.initialize(req);
  // exports.testGoogleMapScraperlibrary();
  const postData = req.body;
  console.log("postData==========", postData);
  // return;
  postData.email = postData.email.toLowerCase();
  postData.password = globalService.encryptString(postData.password);
  if (postData.email) {
    // delete postData.password;
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
  var CatalystApp = catalyst.initialize(req);
  try {
    let userDetails = await  CatalystApp.zcql().executeZCQLQuery('Select * from users order by createdtime');
      userDetails = userDetails.map((item) => {
        item.users._id = item.users.ROWID;
        return item.users
      } );
      // console.log("userDetails=======", userDetails);
    return res.json({
      status: 200,
      message: "Get the user list successfully.",
      data: userDetails,
      totalRecord: userDetails.length
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Some error occrred.",
      data: error,
    });
  }
};

exports.getUsersListServer = async (req, res) => {
  const postData = req.body;

  const limit = parseInt(postData.length);
  const skip = postData.start;
  let orderDir = postData.order[0].dir === "asc" ? 1 : -1;
  //
  let orderField = {
    [postData.columns[postData.order[0].column].data]: orderDir,
  };

  let searchText = {
    $or: [
      {
        firstName: {
          $regex: new RegExp(
            ".*" + postData.search.value.toLowerCase() + ".*",
            "i"
          ),
        },
      },
      {
        lastName: {
          $regex: new RegExp(
            ".*" + postData.search.value.toLowerCase() + ".*",
            "i"
          ),
        },
      },
      {
        email: {
          $regex: new RegExp(
            ".*" + postData.search.value.toLowerCase() + ".*",
            "i"
          ),
        },
      },
    ],
  };

  try {
    const user = await User.find(searchText)
      .limit(limit)
      .skip(skip)
      .sort(orderField);
    const userLenght = await User.countDocuments(searchText);

    return res.json({
      status: 200,
      message: "Get the user list successfully.",
      data: {
        draw: postData.draw,
        recordsTotal: userLenght,
        recordsFiltered: userLenght,
        data: user,
      },
    });
  } catch (err) {
    return res.json({
      status: 500,
      message: "Some error occrred.",
      data: err,
    });
  }
};

exports.getCustomDTUsersListServer = async (req, res) => {
  const postData = req.body;
  console.log("postData: ", postData);

  var allData = {
    data: [],
    totalUsers: 0,
    offset: 0,
  };
  // return;
  var per_page = Number(postData.per_page) || 10;

  var page = postData.currentPage || 1;
  if (page < 1) page = 1;
  var offset = (page - 1) * per_page;

  let searchText = {
    $or: [
      {
        firstName: {
          $regex: new RegExp(".*" + postData.search.toLowerCase() + ".*", "i"),
        },
      },
      {
        lastName: {
          $regex: new RegExp(".*" + postData.search.toLowerCase() + ".*", "i"),
        },
      },
      {
        email: {
          $regex: new RegExp(".*" + postData.search.toLowerCase() + ".*", "i"),
        },
      },
    ],
  };
  try {
    // const user = await User.find()
    const user = await User.find(searchText).limit(per_page).skip(offset);
    const userLenght = await User.countDocuments(searchText);
    allData = {
      data: user,
      totalUsers: userLenght,
      offset: offset,
    };
    return res.json({
      status: 200,
      message: "Get the user list successfully.",
      data: allData,
    });
  } catch (err) {
    return res.json({
      status: 500,
      message: "Some error occrred.",
      data: err,
    });
  }
};

exports.emailAlreadyExists = async (req, res) => {
  var postData = req.body;
  try {
    const emailExitResp = await User.findOne({
      email: postData.email,
    });
    if (emailExitResp) {
      return res.json({
        status: 200,
        message: "This Email Already Exists, please try another one.",
        data: emailExitResp,
      });
    } else {
      return res.json({
        status: 500,
        message: "No Email Found.",
        data: emailExitResp,
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: "No Email Found.",
      data: error,
    });
  }
};

exports.forgotPassword = (req, res) => {
  var postData = req.body;
  postData.email = postData.email.toLowerCase();
  const email = postData.email;
  if (email) {
    var whereObj = {
      email: postData.email,
    };
    User.findOne(whereObj, (err, user) => {
      if (user) {
        // moment(new Date(date)).format('YYYY-MM-DD');

        const rString = globalService.generateString();
        User.updateOne(
          {
            _id: user._id,
          },
          {
            forgotLink: rString,
            forgotStatus: 1,
          },
          (err, forgotResp) => {
            if (forgotResp) {
              const linkParam =
                process.env.WEBSITE_URL +
                "recoverpassword/" +
                user._id +
                "/" +
                rString;
              var prepareEmailConfig = {
                email: user.email,
                firstName: globalService.capitalize(user.firstName),
                markerData: {
                  name: globalService.capitalize(user.firstName),
                  websiteUrl: process.env.WEBSITE_URL,
                  recoverPasswordLink: linkParam,
                  fristname: user.firstName,
                },
                templatePath:
                  "public/assets/emailtemplates/forgot-password.html",
                subject: "Reset your password for AM.ONLINE your account",
                html: "",
                templateName: "forgot-password", // NEW
              };

              globalService.prepareEmailData(
                prepareEmailConfig,
                (err, resp) => {
                  return res.json({
                    status: 200,
                    message:
                      "Please check your email, Reset password link has been sent to " +
                      user.email +
                      ".",
                    data: resp,
                  });
                }
              );
            } else {
              return res.json({
                status: 500,
                message:
                  "No account found with this email address : " + email + ".",
              });
            }
          }
        );
      } else {
        return res.json({
          status: 500,
          message: "No account found with this email address : " + email + ".",
        });
      }
    });
  } else {
    return res.json({
      status: 500,
      message: "No account found with this email address : " + email + ".",
    });
  }
};

exports.authentication = (req, res) => {
  if (req.headers && req.headers.authorization) {
    const authorization = req.headers.authorization.split(" ")[1];
    globalService.verifyToken(authorization, (verifyResp) => {
      if (verifyResp.verify) {
        return res.json({
          status: 200,
          message: "Api authenticated Successfully.",
          currentUser: true,
        });
      } else {
        return res.json({
          status: 500,
          message: "Authentication failed.",
          currentUser: null,
        });
      }
    });
  } else {
    return res.json({
      status: 500,
      message: "Authentication failed.",
      currentUser: null,
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

exports.searchUserData = (req, res) => {
  var postData = req.body;
  console.log("postData: ", postData);

  let searchText = {
    $or: [
      {
        firstName: {
          $regex: new RegExp(".*" + postData.search.toLowerCase() + ".*", "i"),
        },
      },
      {
        lastName: {
          $regex: new RegExp(".*" + postData.search.toLowerCase() + ".*", "i"),
        },
      },
      {
        email: {
          $regex: new RegExp(".*" + postData.search.toLowerCase() + ".*", "i"),
        },
      },
    ],
  };

  User.find(searchText, (err, data) => {
    if (data === null) {
      return res.json({
        status: 500,
        message: "There are some error while getting user data.",
        data: err,
      });
    } else {
      if (data.length) {
        return res.json({
          status: 200,
          message: "Getting User data successfully.",
          data: data,
        });
      } else {
        return res.json({
          status: 500,
          message: "No User Data Found.",
          data: data,
        });
      }
    }
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
  const postData = req.body;
  const whereObj = {
    _id: postData._id,
  };
  const userDelete = await User.deleteOne(whereObj);

  try {
    if (userDelete.deletedCount === 1) {
      return res.json({
        message: "User Delete Successfully.",
        status: 200,
      });
    } else {
      return res.json(globalService.linkExpiryError());
    }
  } catch (err) {}
};

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./photos/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.uploadImg = multer({
  storage: storage,
}).single("image");

exports.profileUpdate = async (req, res) => {
  const postData = req.body;
  if (req.file) {
    let URL = "http://" + req.headers.host + "/upload/" + req.file.filename;
    postData.profileImage = URL;
  }
  if (postData.password) {
    postData.password = globalService.encryptString(postData.password);
  }
  if (postData._id) {
    postData.updatedAt = new Date();
    if (postData.profileOldImage) {
      globalService.removeFile(postData.profileOldImage, () => {});
    }
    User.updateOne(
      {
        _id: postData._id,
      },
      postData,
      (err, resp) => {
        if (err) {
          return res.json({
            status: 500,
            message: "There are some error while update.",
            data: err,
          });
        } else {
          if (!postData.password) {
            req.session.currentUser = postData;
          } else {
            req.session.destroy();
          }
          let checkPassword = postData.password;
          delete postData.password;
          return res.json({
            status: 200,
            message: checkPassword
              ? "Your password has been changed successfully."
              : "User Profile Updated successfully.",
            data: postData,
          });
        }
      }
    );
  } else {
    postData.email = postData.email.toLowerCase();
    const addUser = new User();
    Object.keys(postData).forEach((key) => {
      addUser[key] = postData[key];
    });
    try {
      var userResp = await addUser.save();
      if (userResp) {
        return res.json({
          message: "User Account Created Successfuly.",
          status: 200,
          data: userResp,
        });
      } else {
        return res.json({
          message: "Failed to create account.",
          status: 500,
          error: "Getting issue while creating user account.",
        });
      }
    } catch (error) {
      return res.json({
        message: "Failed to create an user account.",
        status: 500,
        error: error.message,
      });
    }
  }
};


/**
 * Name : saveUserInfoWithProfileImage():
 * Description : By this method Get the list of Deal Details.
 * @param {*} req is a is Deal Details info.
 * @return it will return array of DealDetails.
 */
const uploadFullProfile = multer({ storage: storage });
exports.addProfileImageWithUserInfo = async (req, res, next) => {
  console.log("Main Req1111111>", req.body);
  uploadFullProfile.single("image")(req, res, async (err) => {
    const postData = req.body;
    console.log("Profile Image Post Data1111.55555>", postData);
    console.log("req.file2222222222222", req.file);
    if (req.file) {
      let URL = "http://" + req.headers.host + "/upload/" + req.file.filename;
      console.log("URLURLURLURL222..555555", url);
      postData.profileImage = URL;
      console.log(
        "postData.profileImage = Image-URL333333",
        postData.profileImage
      );
    }
    const addUser = new User();
    Object.keys(postData).forEach((key) => {
      addUser[key] = postData[key];
    });
    try {
      var userResp = await addUser.save();
      if (userResp) {
        return res.json({
          message: "User Account Created Successfuly.",
          status: 200,
          data: userResp,
        });
      } else {
        return res.json({
          message: "Failed to create account.",
          status: 500,
          error: "Getting issue while creating user account.",
        });
      }
    } catch (error) {
      return res.json({
        message: "Failed to create an user account.",
        status: 500,
        error: error.message,
      });
    }
  });
};
