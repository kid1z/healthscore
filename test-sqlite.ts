import Database from "better-sqlite3";

console.log("Testing pure better-sqlite3...");
try {
  const db = new Database("dev.db");
  db.prepare("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)").run();
  console.log("Pure better-sqlite3 works!");
} catch (e) {
  console.error("Pure better-sqlite3 failed:", e);
}
