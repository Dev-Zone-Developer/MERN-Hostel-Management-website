import { Router } from "express";
import { connection } from "../Model/mysql.js";

const information = Router();

information.get('/data', (req, res) => {
    connection.query(
        `SELECT
            (SELECT COUNT(*) FROM user) AS booking,
            (SELECT COUNT(*) FROM room_assignments) AS total_users,
            (SELECT COUNT(*) FROM applypass) AS passes,
            (SELECT COUNT(*) FROM rooms) AS rooms,
            (SELECT COALESCE(SUM(room_capacity), 0) FROM rooms) AS total_capacity,
            (SELECT COALESCE(SUM(room_filled), 0) FROM rooms) AS occupied_capacity,
            (SELECT SUM(CASE WHEN room_capacity = 2 THEN 1 ELSE 0 END) FROM rooms) AS two_seaters,
            (SELECT SUM(CASE WHEN room_capacity = 4 THEN 1 ELSE 0 END) FROM rooms) AS four_seaters;

        `,
        (err, result) => {
            if (err) return console.error(err);

            console.log("Total users:", result[0].total_users);
            console.log("Booking :", result[0].booking);
            console.log("passes :", result[0].passes);
            console.log("total_capacity :", result[0].total_capacity);
            console.log("occupied_capacity :", result[0].occupied_capacity);
            console.log("Total rooms :", result[0].rooms);
            console.log("Total two_seaters :", result[0].two_seaters);
            console.log("Total four_seaters :", result[0].four_seaters);
            res.json({
                booking: result[0].booking,
                users: result[0].total_users,
                passes: result[0].passes,
                total_capacity: result[0].total_capacity,
                occupied_capacity: result[0].occupied_capacity,
                rooms: result[0].rooms,
                two_seaters: result[0].two_seaters,
                four_seaters: result[0].four_seaters,
            })
        }
    );

})
export {
    information
}