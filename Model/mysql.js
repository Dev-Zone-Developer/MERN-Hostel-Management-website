import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()
/// connect Mysql
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
})

connection.connect(error => {
    if (error) {
        console.log("Failed To Connect with Database", error.message)
        return;
    }
    console.log("Database Connected")
})

connection.query(
    "SELECT COUNT(*) AS tableCount FROM information_schema.tables WHERE table_schema = ?",
    [process.env.DB_NAME],
    (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        if (result[0].tableCount === 0) {
            console.log("Database has no tables. Creating new table...");

            const createTableSQL = `
        CREATE TABLE user (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          fullname VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone_number VARCHAR(20) NOT NULL,
          cnic VARCHAR(20) NOT NULL,
          room_type VARCHAR(20) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          message TEXT,
          status VARCHAR(255) DEFAULT 'pending',
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        CREATE TABLE room_prices (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          room_type VARCHAR(20) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        CREATE TABLE admin_account (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(255) NOT NULL DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        CREATE TABLE applypass (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          fullname varchar(255) NOT NULL,
          father_name varchar(255) NOT NULL,
          roll_number varchar(255) NOT NULL,
          reason varchar(255) NOT NULL,
          status varchar(255) NOT NULL DEFAULT 'pending',
          created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        CREATE TABLE rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_name VARCHAR(50) NOT NULL,
            room_filled INT NOT NULL,
            room_capacity INT NOT NULL, -- number of people allowed in the room
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE room_assignments (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            room_id INT NOT NULL,
            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES user(id),
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        );
        INSERT INTO admin_account (name, email, password, role) VALUES 
('Muzammal', 'muzammal@gmail.com', '$2b$10$VciAGxWhKU235zWqA8zPzuqOfGZ0829YCKwAy.pCPVhlnT95vBXI6', 'admin');


        INSERT INTO room_prices ( room_type, price) VALUES
            ('2-person', 10000.00),
            ('4-person', 6000.00);


      `;

            connection.query(createTableSQL, (err, result) => {
                if (err) {
                    console.log("Error creating table:", err);
                } else {
                    console.log("Table 'user' created successfully.");
                }
            });
        }
    }
);


export {
    connection
}