import Database from 'better-sqlite3';
const db = new Database('database.sqlite');

// Add sample categories
const categories = [
  {
    name: 'Gold Rings',
    description: 'Beautiful gold rings for every occasion. Crafted with precision and elegance.',
    image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2ZmZDcwMCIvPjwvc3ZnPg=='
  },
  {
    name: 'Diamond Necklaces',
    description: 'Stunning diamond necklaces that add sparkle to your life. Perfect for special moments.',
    image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzAwYjZmZiIvPjwvc3ZnPg=='
  },
  {
    name: 'Silver Bracelets',
    description: 'Elegant silver bracelets with intricate designs. Timeless beauty for modern women.',
    image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2MwYzBjMCIvPjwvc3ZnPg=='
  },
  {
    name: 'Pearl Earrings',
    description: 'Classic pearl earrings that never go out of style. Sophisticated and graceful.',
    image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg=='
  },
  {
    name: 'Wedding Sets',
    description: 'Complete wedding sets for your special day. Bridal jewelry that makes memories last forever.',
    image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2ZmNjY5OSIvPjwvc3ZnPg=='
  },
  {
    name: 'Anklets',
    description: 'Beautiful anklets that add charm to your steps. Traditional and contemporary designs available.',
    image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzkwZWY2NyIvPjwvc3ZnPg=='
  }
];

const insert = db.prepare('INSERT INTO categories (name, description, image) VALUES (?, ?, ?)');

categories.forEach(cat => {
  try {
    insert.run(cat.name, cat.description, cat.image);
    console.log(`Added category: ${cat.name}`);
  } catch (error) {
    console.error(`Error adding ${cat.name}:`, error.message);
  }
});

console.log('Sample categories added successfully!');
db.close();
