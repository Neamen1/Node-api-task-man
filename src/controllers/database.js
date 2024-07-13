const sqlite3 = require('sqlite3').verbose();

// Create a new database instance
let db = new sqlite3.Database('./tasks.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the tasks.db database.');
    }
});

// Function to close the database connection
function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error(err.message);
            return ;
        }
        console.log('Closed the database connection.');
        setTimeout((function() { 
            return process.kill(process.pid); // close process after database is closed
            }), 500);
    });
}

// Handle process exit for proper database closure
process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);

module.exports = db;
