import { connection } from "../Model/mysql.js";
import { hashPassword } from "../utils/hashedData.js";

const userBookings = (req, res) => {
    const { name, email, phone, cnic, roomType, message, price } = req.body;
    connection.query(
        'SELECT * FROM user ORDER BY id DESC LIMIT 1',
        async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return;
            }

            // Check if last user's CNIC matches
            if (results.length > 0 && results[0].cnic === cnic && results[0].price == price) {
                console.log("User applied recently");
                connection.end();
                return res.json({ message: "User has already applied recently", success: true });
            }

            // Insert new record
            const insertQuery = `
            INSERT INTO user 
            (fullname, email, phone_number, cnic, room_type, price, message, status, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
            const password = await hashPassword(cnic)

            // Convert price to number
            const numericPrice = parseFloat(price); // converts "6000.00" => 6000.00


            const values = [name, email, phone, cnic, roomType, numericPrice, message, 'pending', password];

            connection.query(insertQuery, values, (insertErr, insertResult) => {

                if (insertErr) {
                    console.error("Insert error:", insertErr);
                    return res.status(500).json({ error: "Failed to insert booking" });
                }

                console.log("Booking added successfully");
                res.json({
                    success: true,
                    message: "Booking received successfully",
                    data: { name, email, phone, cnic, roomType, numericPrice, message }
                });

            });
        })
}

export {
    userBookings
}