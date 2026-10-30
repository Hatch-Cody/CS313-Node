
"use strict";

require("dotenv").config();

const { Pool } = require("pg");
const argon2 = require("argon2");

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    ssl: process.env.PGSSL === "false"
        ? false
        : { rejectUnauthorized: true }
});

const HASH_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1
};

const DUMMY_HASH_PROMISE = argon2.hash(
    "dummy-password-for-timing-consistency",
    HASH_OPTIONS
);

function authError(message = "Invalid username or password") {
    const error = new Error(message);
    error.code = "AUTH_FAILED";
    return error;
}

function validateUsername(username) {
    return (
        typeof username === "string" &&
        username.length >= 3 &&
        username.length <= 50 &&
        /^[a-zA-Z0-9_-]+$/.test(username)
    );
}

function validatePassword(password) {
    return (
        typeof password === "string" &&
        Buffer.byteLength(password, "utf8") >= 12 &&
        Buffer.byteLength(password, "utf8") <= 1024
    );
}

function validateEmail(email) {
    return (
        typeof email === "string" &&
        email.length <= 254 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
}

/**
 * Authenticate an existing user.
 *
 * Callback:
 *   callback(error, user)
 *
 * On success:
 *   error = null
 *   user = { id, username, email }
 *
 * On failure:
 *   error = Error
 *   user = null
 */
async function handleLogin(name, pass, callback) {
    if (typeof callback !== "function") {
        throw new TypeError("callback must be a function");
    }

    if (
        !validateUsername(name) ||
        typeof pass !== "string" ||
        pass.length === 0 ||
        Buffer.byteLength(pass, "utf8") > 1024
    ) {
        return callback(authError(), null);
    }

    try {
        const sql = `
            SELECT id, username, email, password_hash
            FROM users
            WHERE username = $1
            LIMIT 1
        `;

        const result = await pool.query(sql, [name]);
        const user = result.rows[0];

        if (!user) {
            // Perform a verification even for unknown users
            // to reduce username-enumeration timing differences.
            const dummyHash = await DUMMY_HASH_PROMISE;
            await argon2.verify(dummyHash, pass);

            return callback(authError(), null);
        }

        const validPassword = await argon2.verify(
            user.password_hash,
            pass
        );

        if (!validPassword) {
            return callback(authError(), null);
        }

        // Never expose password hashes to callers.
        return callback(null, {
            id: user.id,
            username: user.username,
            email: user.email
        });

    } catch (error) {
        console.error("Authentication operation failed:", {
            code: error.code || "UNKNOWN"
        });

        return callback(
            new Error("Authentication service unavailable"),
            null
        );
    }
}

/**
 * Register a new user.
 *
 * Expected params:
 *   [username, password, email]
 *
 * Callback:
 *   callback(error, user)
 */
async function registerUser(params, callback) {
    if (typeof callback !== "function") {
        throw new TypeError("callback must be a function");
    }

    if (!Array.isArray(params) || params.length !== 3) {
        return callback(
            new Error("Invalid registration data"),
            null
        );
    }

    const [username, password, email] = params;

    if (!validateUsername(username)) {
        return callback(
            new Error("Username must be 3–50 characters and contain only letters, numbers, underscores, or hyphens"),
            null
        );
    }

    if (!validatePassword(password)) {
        return callback(
            new Error("Password must be at least 12 characters and no more than 1024 bytes"),
            null
        );
    }

    if (!validateEmail(email)) {
        return callback(
            new Error("Invalid email address"),
            null
        );
    }

    try {
        // Never store plaintext passwords.
        const passwordHash = await argon2.hash(
            password,
            HASH_OPTIONS
        );

        const sql = `
            INSERT INTO users (
                username,
                password_hash,
                email
            )
            VALUES ($1, $2, $3)
            RETURNING id, username, email
        `;

        const result = await pool.query(sql, [
            username,
            passwordHash,
            email
        ]);

        return callback(null, result.rows[0]);

    } catch (error) {
        if (error.code === "23505") {
            return callback(
                new Error("Username or email already exists"),
                null
            );
        }

        console.error("Registration operation failed:", {
            code: error.code || "UNKNOWN"
        });

        return callback(
            new Error("Registration service unavailable"),
            null
        );
    }
}

/**
 * Gracefully close the connection pool.
 */
async function closePool() {
    await pool.end();
}

module.exports = {
    handleLogin,
    registerUser,
    closePool
};
