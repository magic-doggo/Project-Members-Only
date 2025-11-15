const pool = require("./pool");

async function updateDBUserStatus(newStatus, userId) {
    const rows  = await pool.query(`UPDATE Users SET membership_status = $1 WHERE id = $2`, [newStatus, userId])
}

async function storeMessageInDb(title, message, author) {
    const rows = await pool.query('INSERT INTO Messages (title, full_message, author) VALUES ($1, $2, $3)', [title, message, author]);
}

async function getAllMessages() {
    const {rows} = await pool.query(`SELECT Messages.id, Messages.title, Messages.full_message, Messages.timestamp, Users.first_name AS author_name 
        FROM Messages
        Join Users
        ON Messages.author = Users.id
        ORDER BY Messages.timestamp DESC`);
    return rows;
}

module.exports = {
    updateDBUserStatus,
    storeMessageInDb,
    getAllMessages
}