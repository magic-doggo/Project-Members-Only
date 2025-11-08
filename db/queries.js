const pool = require("./pool");

async function updateDBUserStatus(newStatus, userId) {
    const rows  = await pool.query(`UPDATE Users SET membership_status = $1 WHERE id = $2`, [newStatus, userId])
}

module.exports = {
    updateDBUserStatus
}