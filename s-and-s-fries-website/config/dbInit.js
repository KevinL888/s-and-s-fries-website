const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const db = new sqlite3.Database("sns_fries.db");

db.serialize(async function() {
  // Drop existing tables
  db.run("DROP TABLE IF EXISTS users");
  db.run("DROP TABLE IF EXISTS menu_items");
  db.run("DROP TABLE IF EXISTS reviews");

  // Create users table
  db.run(
    `CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'user')) NOT NULL DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`
  );

  // Hash password for admin user and insert
  const saltRounds = 10;
  bcrypt.hash("7yrag7", saltRounds, (err, hash) => {
    if (err) {
      console.error("Error hashing admin password:", err);
    } else {
      db.run(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        ["admin", "garylai220@gmail.com", hash, "admin"],
        function (insertErr) {
          if (insertErr) {
            console.error("Error inserting admin user:", insertErr);
          } else {
            console.log("Admin user created successfully!");
          }
          // Close the database connection after all operations
          db.close((closeErr) => {
            if (closeErr) {
              console.error("Error closing database:", closeErr);
            } else {
              console.log("Database initialized successfully!");
            }
          });
        }
      );
    }
  });

  // Create menu_items table
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
    -- Fresh Cut Fries
    ('Kid''s Fries', 'Classic fresh cut fries (Kid''s size)', 4.00, 'Fries/OnionRings', 'french-fries.jpg'),
    ('Small Fries', 'Classic fresh cut fries (Small size)', 5.50, 'Fries/OnionRings', 'french-fries.jpg'),
    ('Medium Fries', 'Classic fresh cut fries (Medium size)', 6.25, 'Fries/OnionRings', 'french-fries.jpg'),
    ('Large Fries', 'Classic fresh cut fries (Large size)', 7.00, 'Fries/OnionRings', 'french-fries.jpg'),
    ('Family Pack Fries', 'Classic fresh cut fries (Family pack)', 12.00, 'Fries/OnionRings', 'french-fries.jpg'),
	  ('Onion Rings', 'Crispy deep-fried onion rings (Medium Size)', 6.50, 'Fries/OnionRings', 'onion-rings.jpg'),
    
	-- Poutine
    ('Kid''s Poutine', 'Classic poutine with cheese curds and gravy (Kid''s size)', 7.00, 'Poutine', 'poutines.jpg'),
    ('Small Poutine', 'Classic poutine with cheese curds and gravy (Small size)', 9.00, 'Poutine', 'poutines.jpg'),
    ('Medium Poutine', 'Classic poutine with cheese curds and gravy (Medium size)', 11.00, 'Poutine', 'medium-poutine.jpg'),
    ('Large Poutine', 'Classic poutine with cheese curds and gravy (Large size)', 13.00, 'Poutine', 'large-poutine.jpg'),

    -- Platters (All Platters Include Fries and Drink)
    ('Cheeseburger Platter', 'Cheeseburger served with fries and drink', 12.25, 'Platters', 'cheeseburger-platter.jpg'),
    ('Chicken Burger Platter', 'Chicken burger served with fries and drink', 12.25, 'Platters', 'chicken-burger-platter.jpg'),
    ('Double Pogo Platter', 'Two pogos served with fries and drink', 12.50, 'Platters', 'pogo-platter.jpg'),
    ('Double Hot Dog Platter', 'Two hot dogs served with fries and drink', 12.50, 'Platters', 'double-hotdog-platter.jpg'),
    ('Sausage Platter', 'Grilled sausage served with fries and drink', 12.25, 'Platters', 'sausage-platter.jpg'),
    ('Single Pogo Platter', 'One pogo served with fries and drink', 10.50, 'Platters', 'pogo-platter.jpg'),
    ('Single Hot Dog Platter', 'One hot dog served with fries and drink', 10.50, 'Platters', 'hotdog-combo.jpg'),
    ('Hamburger Platter', 'Hamburger served with fries and drink', 11.75, 'Platters', 'hamburger-platter.jpg'),

    -- Sandwiches
    ('Hamburger', 'Classic grilled hamburger', 5.50, 'Sandwiches', 'hamburger.jpg'),
    ('Cheeseburger', 'Juicy beef patty with melted cheese', 6.00, 'Sandwiches', 'cheeseburger.jpg'),
    ('Chicken Burger', 'Crispy chicken burger with lettuce and mayo', 6.00, 'Sandwiches', 'chicken-burger.jpg'),
    ('Chicken Fingers & Fries', 'Breaded chicken fingers served with fries', 12.00, 'Sandwiches', 'chicken-fingers.jpg'),
    ('Hot Dog', 'Grilled hot dog in a fresh bun', 4.00, 'Sandwiches', 'hotdog.jpg'),
    ('Cheese Dog', 'Hot dog with melted cheese', 4.50, 'Sandwiches', 'cheese-dog.jpg'),
    ('Pogo', 'Battered corn dog on a stick', 4.00, 'Sandwiches', 'pogo.jpg'),
    ('Sausage', 'Grilled sausage in a bun', 6.00, 'Sandwiches', 'sausage.jpg'),

    -- Drinks
    ('Soft Drinks', 'Pepsi, Diet Pesi, Coke, Diet Coke, Coke Zero, Root Beer, Sprite, Canada Dry, Orange Crush, Spring Water, Ice Tea', 2.00, 'Drinks', 'soft-drinks.jpg'),

    -- Extras
    ('Sub Fries for Poutine', 'Upgrade your meal by replacing fries with poutine', 3.00, 'Extras', 'chicken-fingers.jpg'),
    ('Extra Cheese', 'Extra cheese topping', 3.00, 'Extras', 'extra-cheese.jpg'),
    ('Add Bacon (Slice)', 'Add crispy bacon to any meal', 0.75, 'Extras', 'bacon-slice.jpg'),

    -- Gravy
    ('Gravy', 'Rich homemade gravy', 1.25, 'Extras', 'gravy.jpg'),
    ('Gravy on the Side (Small)', 'Small portion of gravy on the side', 1.75, 'Extras', 'gravy.jpg'),
    ('Gravy on the Side (Large)', 'Large portion of gravy on the side', 2.25, 'Extras', 'gravy.jpg')
`);


  // Create reviews table
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
    (1, 'Jiesi Ren', 5, 'S&S poutines never fail to impress! They are one of few spots that actually have great poutine in Ottawa that gets me going back every so often. Fries are always crispy and often even ones that have been covered in gravy. The curds are high quality and don’t melt immediately. As others have noted, they don’t heavily salt their poutine fries or gravy, which I actually prefer over extremely salty gravy. The gravy is nice and thick with a rich gooey consistency that prevents fries from immediately becoming soggy. I often ask for extra gravy layered in for a small extra charge, which lets me have abundant gravy for every bite of fry.'),
    (1, 'Tony Morgan', 5, 'One of the best cheeseburgers and poutine I''ve ever had in my life. Service is super kind.'),
    (1, 'Michael D', 5, 'I ordered a poutine there and it was a very good size and it was delicious. The owners were in there and they were very kind and have a great sense of humour. It''s great to see people running a business and having genuine passion for their work!'),
    (1, 'Christina Marie', 5, 'We love this little fry stand for poutine! For us, it’s the best poutines we’ve had here in Ottawa. The owners are awesome, the food is fast and fresh and the cheese curds are always “squishy” - as they should be. Highly recommend this place to anyone for a quick, delicious bite.'),
    (1, 'Melanie L', 5, 'Best chip truck around! The large poutine is an amazing deal for the price. Squeaky curds, crispy fries, good gravy, fast and nice service. Haven''t had a good poutine in so long until finding this place!! You need to eat here!')
`);
});

console.log("Database initialized with menu items and reviews!");
