import { connection } from "../Model/mysql.js"
import bcrypt from 'bcrypt'

const updateEmail = (req, res) => {

    const { email } = req.body

    connection.query(
        `UPDATE admin_account SET email=? WHERE 1`, [email], (error, results) => {
            if (error) {
                console.log("Failed to update email", error);
                return res.status(500).json({ success: false, message: "Database error and failed to update email" });

            }
            return res.status(200).json({
                success: true,
                message: "Successfully Update Email"
            })
        }
    )
}

const updatePasswords = async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, message: "Password is required" });
    }

    try {
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        connection.query(
            `UPDATE admin_account SET password=? WHERE 1`,
            [hashedPassword],
            (error, results) => {
                if (error) {
                    console.log("Failed to update Password", error);
                    return res.status(500).json({
                        success: false,
                        message: "Database error and failed to update Password"
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Successfully Updated Password"
                });
            }
        );
    } catch (err) {
        console.log("Hashing error:", err);
        return res.status(500).json({ success: false, message: "Failed to encrypt password" });
    }
};
const rentprices = (req, res) => {
    connection.query(`SELECT * FROM room_prices`, (data, prices) => {
        if (data) {
            console.log("Failed to update Password", data);
            return res.status(500).json({
                error: true,
                message: "Database error and failed to update Password"
            });
        }
        return res.status(200).json(prices)
    })
}
const rentpricesupdate = (req, res) => {
    const { double, fourth } = req.body; // destructure values

    if (!double || !fourth) {
        return res.status(400).json({ success: false, message: "Both prices are required" });
    }

    // Example using MySQL
    const query = `
        UPDATE room_prices
        SET price = CASE
            WHEN room_type = '2-person' THEN ?
            WHEN room_type = '4-person' THEN ?
        END
        WHERE room_type IN ('2-person', '4-person')
    `;

    connection.query(query, [double, fourth], (err, result) => {
        if (err) {
            console.log("Failed to update room prices:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        return res.status(200).json({ success: true, message: "Prices updated successfully" });
    });

}
export {
    updateEmail, updatePasswords, rentprices, rentpricesupdate
}