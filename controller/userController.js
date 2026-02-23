const db = require("../config/db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  const checkQuery = `SELECT * FROM users WHERE email = ?`;

  db.query(checkQuery, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
  return res.status(409).json({ message: "Email already exists" });
}

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const role = "user";
      const profile =
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

      const addquery = `
                INSERT INTO users (name, email, phone, password, role, profile) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;

      db.query(
        addquery,
        [name, email, phone, hashedPassword, role, profile],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error in adding data" });
          }

          return res.status(201).json({
            message: "Registration successful",
          });
        },
      );
    } catch (error) {
      return res.status(500).json({ message: "Password hashing failed" });
    }
  });
};







exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  checkQuery = `SELECT * FROM users WHERE email=?`;

  db.query(checkQuery, [email], async (err, result) => {
    if (err) {
      console.log("server err login", err);
      return res.status(500).json({ message: "server error", err });
    }
    if (result.length === 0) {
      return res.status(400).json({ message: "email is Not registred" });
    }

    const loginUser = result[0];
    const ispassMatch = await bcrypt.compare(password, loginUser.password);
    if (ispassMatch) {
      // jwt token generation
      const token = jwt.sign(
        { userMail: loginUser.email, role: loginUser.role },
        process.env.jwtkey,
      );
      //  console.log("jwt token ",token);

      res.status(200).json({ message: "login successfull", token ,loginUser});
    } else {
      res.status(400).json({ message: "password missmatch" });
    }
  });
};


exports.googleLogin= async(req,res)=>{


  try{
  const {email,name,profile}=req.body
  checkQuery = `SELECT * FROM users WHERE email=?`
  db.query(checkQuery,[email], async(err,result)=>{
    
    if(err){
      console.log(err);
     return res.status(500).json({message:"error in checkQuery"}) 
    }
// ✅ If user already exists → Login
      if (result.length > 0) {
        const loginUser = result[0];

        const token = jwt.sign(
          { userMail: loginUser.email, role: loginUser.role },
          process.env.jwtkey,
          { expiresIn: "1d" }
        );

        return res.status(200).json({
          message: "Login successful",
          token,
          loginUser,
        });
      }

  

    // ✅ If new user → Register
      const phone = "000000";
      const password='123456'
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = "user";

      const addQuery = `
        INSERT INTO users (name, email, phone, password, role, profile) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        addQuery,
        [name, email, phone, hashedPassword, role, profile],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error in adding user" });
          }
console.log(result.userResult);
 
          const token = jwt.sign(
            { userMail: email, role },
            process.env.jwtkey
          );

          return res.status(201).json({
            message: "Registration successful",
            token,role:"user"

          });
        }
      );
    });
  }
  catch(err){
console.log(err);
res.status(500).json({message:"server error"})


  }
}