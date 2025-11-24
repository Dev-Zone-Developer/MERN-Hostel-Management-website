import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { connection } from "../Model/mysql.js"



dotenv.config()

const userLogin = (req, res) => {
    const { email, password } = req.body;

    connection.query(
        `SELECT * FROM admin_account WHERE email = ?`, [email], async (error, result) => {
            if (result.length > 0) {
                const machedpassowrd = await bcrypt.compare(password, result[0].password);
                if (machedpassowrd) {
                    const token = jwt.sign({
                        id: result[0].id, email: result[0].email, role: 'admin'
                    }, process.env.JWT_SECRET, {
                        expiresIn: '7d'
                    })
                    res.cookie("authToken", token, {
                        httpOnly: true,
                        secure: false,      // true only on HTTPS
                        sameSite: "none",    // allows sending cookie on cross-origin requests
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });


                    res.status(200).json({
                        success: true,
                        role: 'admin',
                        message: "You are a admin",
                        cookie: token
                    })
                } else {
                    res.status(401).json({
                        success: false,
                        message: 'Password is wrong'
                    });
                }
            } else {
                res.json({
                    role: 'user',
                    message: "You are a user"
                })
            }
        }
    )
}
const checkAuth = (req, res) => {
    const token = req.cookies.authToken;
    // 2. Header token
    const authHeader = req.headers.authorization;
    const cookietoken = authHeader ? authHeader.split(" ")[1] : null;



    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return res.json({ loggedIn: true, role: decoded.role });
        } catch (err) {
            return res.json({ loggedIn: false, err: err });
        }
    }
    if (cookietoken) {
        try {
            const decoded = jwt.verify(cookietoken, process.env.JWT_SECRET);
            return res.json({ loggedIn: true, role: decoded.role });
        } catch (err) {
            return res.json({ loggedIn: false, err: err });
        }
    }
    if (!token || !cookie) return res.json({ loggedIn: false, message: "no token" });
};

export {
    userLogin, checkAuth
}