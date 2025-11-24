import { Router } from "express";
import { userLogin, checkAuth } from "../controller/userLogin.js";

const isloggin = Router();

isloggin.post('/login', userLogin);
isloggin.get('/check-auth', checkAuth);
// logout route
isloggin.post('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logged out successfully' });
});

export {
    isloggin
}