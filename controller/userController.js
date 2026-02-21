const db = require('../config/db')



const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {

    const { name, email, phone, password } = req.body;

    const checkQuery = `SELECT * FROM users WHERE email = ?`;

    db.query(checkQuery, [email], async (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const role = "user";
            const profile = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

            const addquery = `
                INSERT INTO users (name, email, phone, password, role, profile) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(addquery, [name, email, phone, hashedPassword, role, profile], (err, result) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Error in adding data" });
                }

                return res.status(201).json({
                    message: "Registration successful"
                });

            });

        } catch (error) {
            return res.status(500).json({ message: "Password hashing failed" });
        }

    });

};