import { Router } from "express";
import { getpassdata, searchpassdata, updateStatus } from "../controller/adminPass.js";
import { adminbooking, adminbookingsearch } from "../controller/adminbooking.js";
import { connection } from "../Model/mysql.js";
import { roomAssign, roomDetails, roomRemove, searchUsers } from "../controller/roomAssign.js";
import { updateEmail, updatePasswords, rentprices, rentpricesupdate } from "../controller/updateadmin.js";


const adminRoute = Router()


adminRoute.get('/applypass', getpassdata).post('/applypass', searchpassdata)
adminRoute.post('/update-pass', updateStatus)
adminRoute.get('/bookings', adminbooking).post('/bookings', adminbookingsearch)
adminRoute.get('/rooms', (req, res) => {
    connection.query("SELECT * FROM rooms ORDER BY id ASC", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err });
        res.json(results);
    });
})
adminRoute.post('/rooms', (req, res) => {
    const { room_name, room_capacity } = req.body;

    if (!room_name || !room_capacity) {
        return res.status(400).json({ success: false, message: "Missing data" });
    }

    const room_filled = 0; // NEW — required for your table

    connection.query(
        "INSERT INTO rooms (room_name, room_capacity, room_filled) VALUES (?, ?, ?)",
        [room_name, room_capacity, room_filled],
        (err, result) => {
            if (err) {
                console.log("Room insert error:", err);
                return res.status(500).json({ success: false, message: err });
            }
            res.json({ success: true, room_id: result.insertId });
        }
    );
});

adminRoute.delete("/rooms/:id", (req, res) => {
    const { id } = req.params;
    connection.query("DELETE FROM rooms WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err });
        res.json({ success: true });
    });
});
adminRoute.post('/assign-room', roomAssign)
adminRoute.post('/searchUsers', searchUsers)
adminRoute.post('/roomdetails', roomDetails)
adminRoute.post('/roomremove', roomRemove)
adminRoute.post('/update-email', updateEmail)
adminRoute.post('/update-passwords', updatePasswords)
adminRoute.get('/rentprices', rentprices).post('/rentprices', rentpricesupdate)




export {
    adminRoute
}