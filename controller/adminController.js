const db= require("../config/db")



exports.adminAccess=async(req, res) => {
    res.status(200).json({ message: "Welcome Admin" });
  }