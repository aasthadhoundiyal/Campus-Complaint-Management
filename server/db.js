/**
 * db.js — Initialise lowdb JSON file-based storage.
 *
 * Storage file: server/data/campus.json
 *
 * Shape:
 * {
 *   users: [...],
 *   complaints: [...],
 * }
 *
 * lowdb v1 uses synchronous reads/writes and is pure JavaScript —
 * no native compilation needed.
 */

const low    = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path   = require('path');
const fs     = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE  = path.join(DATA_DIR, 'campus.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const adapter = new FileSync(DB_FILE);
const db      = low(adapter);

// Set default structure if the file is empty / new
db.defaults({ users: [], complaints: [] }).write();

module.exports = db;
