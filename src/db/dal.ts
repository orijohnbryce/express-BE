const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Path to the SQLite database file
const dbPath = path.resolve(__dirname, "./sqlite.db");

// Function to run an SQL query
export function runQuery(query, qParams: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    // Open the database
    const db = new sqlite3.Database(dbPath, (err: any) => {
      if (err) {
        return reject(err); // it is not must to use return. (it is to prevent next code to run)
      }
    });

    // Run the query
    try {
      db.all(query, qParams, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows); // don't return, (to run next lines - closing the DB)
      });
    } catch (error) {
      return reject(error);
    }

    // Close the database
    db.close((err) => {
      if (err) {
        return reject(err);
      }
    });
  });
}
