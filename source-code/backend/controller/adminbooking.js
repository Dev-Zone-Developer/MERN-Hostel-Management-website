import { connection } from "../Model/mysql.js"

const adminbooking = (req, res) => {
    const query = `
    SELECT * FROM user ORDER BY id DESC
  `
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err)
            return res.status(500).json({ error: 'Database error' })
        }
        res.json(results)
    })
}
const adminbookingsearch = (req, res) => {
    const { search } = req.body;

    if (!search || search.trim() === '') {
        return res.json([]);
    }

    const keyword = `%${search}%`;

    const query = `
        SELECT *
        FROM user
        WHERE fullname LIKE ?
           OR email LIKE ?
           OR phone_number LIKE ?
           OR REPLACE(cnic, '-', '') LIKE ?
        ORDER BY id DESC
    `;

    connection.query(query, [keyword, keyword, keyword, keyword], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        

        return res.json(results);
    });
}
export {
    adminbooking, adminbookingsearch
}