import { connection } from "../Model/mysql.js";

const roomPrices = (req, res) => {
    connection.query(
        `SELECT * FROM room_prices`,
        async (error, results) => {
            if (error) {
                console.log("Error fetching room prices:", error);
                return res.status(500).json({ error: true, message: "Database error" });

            }
            // const hashed = await hashPassword("123456")
            // console.log("Hashed Password", hashed)
            res.status(200).json(results)
        }
    )
}

export default roomPrices