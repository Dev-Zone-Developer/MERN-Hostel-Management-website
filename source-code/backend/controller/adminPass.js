import dotenv from "dotenv"
dotenv.config();
import { connection } from "../Model/mysql.js";
import { sendEmail } from "../utils/sendEmail.js";


const getpassdata = (req, res) => {
    // Get all pass requests

    const query = `
    SELECT id, fullname, father_name, roll_number, reason, status, created_at 
    FROM applypass
    ORDER BY id DESC
  `
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err)
            return res.status(500).json({ error: 'Database error' })
        }
        res.json(results)
    })
}
const searchpassdata = (req, res) => {
    const { search } = req.body

    // if nothing typed, just return empty list or all data
    if (!search || search.trim() === '') {
        return res.json([])
    }

    const keyword = `%${search}%` // add % for partial match

    const query = `
    SELECT id, fullname, father_name, roll_number, reason, status, created_at
    FROM applypass
    WHERE fullname LIKE ? OR roll_number LIKE ?
    ORDER BY id DESC
  `

    connection.query(query, [keyword, keyword], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err)
            return res.status(500).json({ success: false, message: 'Database error' })
        }

        res.json(results)
    })
}

const updateStatus = (req, res) => {
    const { roll_number, status, blockedUser, unblockedUser } = req.body
    if (blockedUser) {
        connection.query(
            `UPDATE user SET blocked = "blocked" WHERE cnic = ?`,
            [roll_number],
            (err, result) => {
                if (err) {
                    console.error("Error updating blocked:", err);
                    return res.status(500).json({
                        message: "Database error",
                        error: err
                    });
                }

                // Send response and stop function here
                return res.json({
                    success: true,
                    message: "User blocked successfully"
                });
            }
        );

        return; // IMPORTANT: stop execution
    }
    if (unblockedUser) {
        connection.query(
            `UPDATE user SET blocked = "allow" WHERE cnic = ?`,
            [roll_number],
            (err, result) => {
                if (err) {
                    console.error("Error updating Status:", err);
                    return res.status(500).json({
                        message: "Database error",
                        error: err
                    });
                }

                // Send response and stop function here
                return res.json({
                    success: true,
                    message: "User unblocked successfully"
                });
            }
        );

        return; // IMPORTANT: stop execution
    }
    const query = `
    UPDATE applypass
    SET status = ?
    WHERE roll_number = ?
  `;

    connection.query(query, [status, roll_number], (err, result) => {
        if (err) {
            console.error('Error updating status:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (status === "approved") {
            connection.query(
                "SELECT fullname, email FROM user WHERE cnic = ? ORDER BY id DESC LIMIT 1",
                [roll_number],
                async (fail, rows) => {
                    if (fail) {
                        console.error("Database error:", fail);
                        return res.status(500).json({ message: "Database error", error: fail });
                    }

                    if (!rows.length) {
                        return res.status(404).json({ message: "User not found" });
                    }

                    const { fullname, email } = rows[0];

                    const subject = "Your Pass Request Has Been Approved";
                    const body = `Hello ${fullname}, your Pass status has been approved.`;

                    const result = await sendEmail(email, subject, body);

                    if (result.success) {
                        return res.json({
                            message: "Status updated successfully and email sent.",
                            roll_number,
                            status
                        });
                    }

                    return res.json({
                        message: "Status updated successfully but email failed to send.",
                        roll_number,
                        status,
                        error: result.error
                    });
                }
            );
            return;
        }
        return res.json({ message: 'Status updated successfully', roll_number, status });
    });
}

export { getpassdata, searchpassdata, updateStatus }    