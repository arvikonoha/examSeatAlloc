const User = require("../Schema/User");

module.exports.findUser = async function(username) {
  return new Promise(async (resolve, reject) => {
    try {
      let isUser = await User.findOne({ username });
      if (isUser) resolve(isUser);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.findUserById = async function(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      let isUser = await User.findOne({ _id: userId });
      if (isUser) resolve(isUser);
    } catch (error) {
      reject(error);
    }
  });
};
