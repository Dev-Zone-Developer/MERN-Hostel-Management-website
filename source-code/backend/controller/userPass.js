import { connection } from "../Model/mysql.js";

const userPass = (req, res) => {
    const { name, fatherName, cnic, reason } = req.body;

    connection.query(`SELECT * FROM user WHERE cnic LIKE ? LIMIT 1`, [`%${cnic}%`], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ success: false, message: 'Database error', err: true });
        }
        if (!results || results.length === 0) {
            return res.json({ success: false, err: true, message: "User cannot Apply for Pass without Booking" });
        }
        if (results[0].blocked == "blocked") {
            return res.json({ success: false, err: true, message: "Blocked User cannot Apply for Pass" });
        }
        if (results[0].fathername == "waiting") {
            connection.query(`UPDATE user SET fathername = ? WHERE cnic = ?`, [fatherName, cnic], (err, result) => {
                if (err) {
                    console.error('Error fetching data:', err);
                    return res.status(500).json({ success: false, message: 'Database error', err: true });
                }
                connection.query(`
                        INSERT INTO applypass(fullname, father_name, roll_number, reason) VALUES (?,?,?,?)
                    `, [name, fatherName, cnic, reason], (error, data) => {
                    if (error) {
                        console.error('Error fetching data:', error);
                        return res.status(500).json({ success: false, message: 'Database error', err: true });
                    }
                    return res.status(200).json({ success: true, data: results[0] });
                })
            })
            return
        }

        // 3. Insert into applypass
        connection.query(
            `INSERT INTO applypass (fullname, father_name, roll_number, reason) VALUES (?, ?, ?, ?)`,
            [name, fatherName, cnic, reason],
            (err, insertResult) => {
                if (err) {
                    console.error("Error inserting pass:", err);
                    return res.status(500).json({ success: false, message: "Database error", err: true });
                }



                return res.status(200).json({
                    success: true,
                    message: "Pass applied successfully",
                });
            }
        );
    })
}
export {
    userPass
}