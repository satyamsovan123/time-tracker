const bcrypt = require("bcrypt");
const saltRounds = process.env.SALTROUNDS;

const encryptPassword = async (req, res) => {
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    // Store hash in your password DB.
  });
};
const decryptPassword = async (req, res) => {
  bcrypt.compare(someOtherPlaintextPassword, hash, function (error, result) {
    // result == true
  });
};

module.exports = { encryptPassword, decryptPassword };
