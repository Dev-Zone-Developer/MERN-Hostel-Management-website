// roomAssignController.js
import { connection } from "../Model/mysql.js";
import { sendEmail } from "../utils/sendEmail.js";

// Promisified query helper
function queryPromise(sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

// Assign room to a user
const roomAssign = async (req, res) => {
    const { cnic, room_name, email } = req.body;

    if (!cnic || !room_name) {
        return res.status(400).json({ success: false, message: "CNIC and room name are required" });
    }

    try {
        // 1. Find user by CNIC
        const [user] = await queryPromise("SELECT * FROM user WHERE cnic = ?", [cnic]);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // 2. Find room by name
        const [room] = await queryPromise("SELECT * FROM rooms WHERE room_name = ?", [room_name]);
        if (!room) return res.status(404).json({ success: false, message: "Room not found" });

        // 3. Check if room is full
        if (room.room_filled >= room.room_capacity) {
            return res.status(400).json({ success: false, message: "Room already full" });
        }

        // 4. Check if user is already assigned
        const assigned = await queryPromise("SELECT * FROM room_assignments WHERE user_id = ?", [user.id]);
        if (assigned.length) {
            const roomName = await queryPromise("SELECT room_name FROM rooms WHERE id = ?", [assigned[0].room_id]);
            console.log(roomName)
            return res.status(400).json({ success: false, message: `User already assigned to room ${roomName[0].room_name}` });
        }


        // 5. Start transaction
        await queryPromise("START TRANSACTION");

        try {
            // 5. Insert assignment
            await queryPromise(
                "INSERT INTO room_assignments (user_id, room_id) VALUES (?, ?)",
                [user.id, room.id]
            );

            // 6. Increment room filled
            await queryPromise(
                "UPDATE rooms SET room_filled = room_filled + 1 WHERE id = ?",
                [room.id]
            );

            // 7. Update user status
            const statusMsg = `Room Approved. Your room number is ${room_name}`;
            await queryPromise(
                "UPDATE user SET status = ? WHERE cnic = ?",
                [statusMsg, user.cnic]
            );

            // 8. Commit transaction
            await queryPromise("COMMIT");

            /// Sending Email to users with fullname and subject apply for room and and room name
            const subject = "Your Room Assignment is Approved";
            const body = `Hello ${user.fullname}, your room assignment is approved. Your room number is ${room_name}.`;

            // Send email
            const mailResult = await sendEmail(user.email, subject, body);

            if (mailResult.success) {
                return res.json({
                    success: true,
                    message: `User assigned to ${room.room_name} and email sent successfully`
                });
            }
            res.json({ success: true, message: `User assigned to ${room.room_name}` });
        } catch (err) {
            // Rollback if any step fails
            await queryPromise("ROLLBACK");
            throw err;
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
const searchUsers = (req, res) => {
    const { cnic } = req.body;

    if (!cnic) {
        return res.status(400).json({ success: false, message: "Missing CNIC" });
    }

    connection.query(
        `SELECT * FROM user WHERE cnic LIKE ? LIMIT 1`,
        [`%${cnic}%`],
        (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ success: false, err: 'Database error' });
            }

            if (!results || results.length === 0) {
                return res.status(404).json({ success: false, message: "No user found" });
            }

            res.status(200).json({ success: true, data: results[0] });
        }
    );
};
const roomDetails = (req, res) => {
    const { roomId } = req.body;
    const myquery = `SELECT u.id, u.fullname, u.cnic, u.email, u.phone_number, u.room_type, u.price, ra.assigned_at FROM room_assignments ra JOIN user u ON ra.user_id = u.id WHERE ra.room_id = ?;`;

    connection.query(myquery, [roomId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ success: false, err: 'Database error' });
        }
        res.json({ success: true, users: results });
    })
}
// Remove user from room
const roomRemove = async (req, res) => {
    const { cnic } = req.body;

    if (!cnic) {
        return res.status(400).json({ success: false, message: "CNIC is required" });
    }

    try {
        // 1. Find user by CNIC
        const [user] = await queryPromise("SELECT * FROM user WHERE cnic = ?", [cnic]);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // 2. Check if user is assigned to a room
        const [assignment] = await queryPromise(
            "SELECT * FROM room_assignments WHERE user_id = ?",
            [user.id]
        );

        if (!assignment) {
            return res.status(400).json({ success: false, message: "User is not assigned to any room" });
        }

        // 3. Start transaction
        await queryPromise("START TRANSACTION");

        try {
            // 4. Delete room assignment
            await queryPromise(
                "DELETE FROM room_assignments WHERE user_id = ?",
                [user.id]
            );

            // 5. Decrement room filled count
            await queryPromise(
                "UPDATE rooms SET room_filled = room_filled - 1 WHERE id = ? AND room_filled > 0",
                [assignment.room_id]
            );

            // 6. Update user status
            await queryPromise(
                "UPDATE user SET status = 'pending' WHERE cnic = ?",
                [user.cnic]
            );

            // 7. Commit transaction
            await queryPromise("COMMIT");

            res.json({ success: true, message: `User removed from room ${assignment.room_id}` });
        } catch (err) {
            // Rollback if any step fails
            await queryPromise("ROLLBACK");
            throw err;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



export { roomAssign, searchUsers, roomDetails, roomRemove };
