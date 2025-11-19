import { pool } from "../config/db.js";

export const checkAdmin = async (req, res) => {
    const adminUsername = req.query.username;

    try {
        const { rows } = await pool.query(`SELECT id FROM admins WHERE username = $1`, [adminUsername]);
        const isAdmin = rows.length > 0 ? true : false;
        return res.json({ isAdmin });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAdmins = async (req, res) => {
    try {
        const { rows } = await pool.query(`SELECT username FROM admins`);
        return res.json({ admins: rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
}

export const addAdmin = async (req, res) => {
    const { username } = req.query;
    try {
        await pool.query(`INSERT INTO admins (username) VALUES ($1)`, [username]);
        return res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteAdmin = async (req, res) => {
    const { username } = req.query;
    try {
        await pool.query(`DELETE FROM admins WHERE username = $1`, [username]);
        return res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
}

export const getAllWithdrawals = async (req, res) => {

    try {
        const { rows } = await pool.query(`SELECT * FROM withdrawal_requests`);
        return res.json({ withdrawals: rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};


export const getUsers = async (req, res) => {
    try {
        let { page = 1, limit = 50 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;

        // 1️⃣ Get users (paginated)
        const usersQuery = await pool.query(
            `
            SELECT id, telegram_id, username, name, profile_photo, referral_count, created_at
            FROM users
            ORDER BY referral_count DESC
            LIMIT $1 OFFSET $2
            `,
            [limit, offset]
        );

        return res.json({
            users: usersQuery.rows,
            has_more: usersQuery.rows.length === limit
        });
    } catch (err) {
        console.error("❌ Error fetching users:", err.message);
        return res.status(500).json({ error: "Server error" });
    }
};
export const getUsers = async (req, res) => {
    try {
        let { page = 1, limit = 20 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;

        // Get users with pagination
        const usersQuery = await pool.query(
            `
            SELECT id, telegram_id, username, name, profile_photo, referral_count, created_at
            FROM users
            ORDER BY referral_count DESC
            LIMIT $1 OFFSET $2`
            ,
            [limit, offset]
        );

        let totalUsers = null
        if (page === 1) {
            const countQuery = await pool.query(`SELECT COUNT(*) FROM users`);
            totalUsers = parseInt(countQuery.rows[0].count);
            console.log("User counted ", totalUsers)
        };

        return res.json({
            users: usersQuery.rows,
            has_more: usersQuery.rows.length === limit,
            total_users: totalUsers
        });
    } catch (err) {
        console.error("❌ Error fetching users:", err.message);
        return res.status(500).json({ error: "Server error" });
    }
};
