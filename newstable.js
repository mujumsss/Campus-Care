import db from './src/lib/db.js';

db.prepare(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      image_path TEXT
    )
`).run();
  
const dummyNews = [
  // News 1: has title, content, image
  {
    title: 'Order Expected in upcomming event',
    content: `
      1. Prepare the patty:
         Mix 200g of ground beef with salt and pepper. Form into a patty.

      2. Cook the patty:
         Heat a pan with a bit of oil. Cook the patty for 2-3 minutes each side, until browned.

      3. Assemble the burger:
         Toast the burger bun halves. Place lettuce and tomato on the bottom half. Add the cooked patty and top with a slice of cheese.

      4. Serve:
         Complete the assembly with the top bun and serve hot.
    `,
    image_path: '/news_images/burger.jpg',
  },

  // News 2: title content
  {
    title: 'Block C will lack water for 2 days as repairs are done',
    content: `The water supply to Block C has been interrupted for the past 3 days, making sanitation very difficult.`,
    image_path: null,
  },

  // News 3: 
  {
    title: 'Wi-Fi problems in Library',
    content: `Internet in the library wont be availabe on tuesday as repairs are done`,
    image_path: null,
  },

  // News 4: title content image
  {
    title: 'Dirty Classrooms',
    content: `Classrooms around block C will be harder to clean this week. Bear with us.`,
    image_path: '/news_images/curry.jpg',
  }
];

async function initData() {
  const insertStmt = db.prepare(`
    INSERT INTO news (
      title,
      content,
      image_path
    ) VALUES (
      @title,
      @content,
      @image_path
    )
`);

for (const news of dummyNews) {
  insertStmt.run(news);
}

console.log("Dummy news inserted.");
}

initData();