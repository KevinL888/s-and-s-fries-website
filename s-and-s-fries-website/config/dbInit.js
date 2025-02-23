const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("sns_fries.db");

db.serialize(function() {
  // Create menu_items table
  db.run("DROP TABLE IF EXISTS menu_items");
  db.run(`
    CREATE TABLE menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT
    )
  `);

  // Insert sample menu items
  db.run(`INSERT INTO menu_items (name, description, price, category, image_url) VALUES 
    ('Poutine', 'Classic fries with cheese curds and gravy', 6.99, 'Fries', 'poutine.jpg'),
    ('Cheeseburger', 'Juicy beef patty with melted cheese', 8.99, 'Burgers', 'cheeseburger.jpg'),
    ('Hot Dog', 'Grilled hot dog in a fresh bun', 4.99, 'Hot Dogs', 'hotdog.jpg')
  `);

  // Create reviews table
  db.run("DROP TABLE IF EXISTS reviews");
  db.run(`
    CREATE TABLE reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_item_id INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      review_text TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    )
  `);

  // Insert sample reviews
  db.run(`INSERT INTO reviews (menu_item_id, customer_name, rating, review_text) VALUES 
    (1, 'John Doe', 5, 'Best poutine I’ve ever had!'),
    (2, 'Jane Smith', 4, 'Great burger, but could use more sauce')
  `);
});

console.log("Database initialized with menu items and reviews!");
