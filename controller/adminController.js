const users = require('../Models/UserModel.js');


exports.adminAccess=async(req, res) => {
    res.status(200).json({ message: "Welcome Admin" });
  }


exports.adminAllCustomerView = async (req, res) => {
  try {
    // get all users except admin
    const allUsers = await users.find({ role: { $ne: "admin" } });

    res.status(200).json({
      message: "All users data",
      users: allUsers
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
      err
    });
  }
};