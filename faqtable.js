import db from './src/lib/db.js';


db.prepare(`
    CREATE TABLE IF NOT EXISTS faq (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL
    )
`).run();

const dummyFAQ = [
    // FAQ 1: 
    {
      question: 'Order Expected in upcomming event',
      answer: `
        1. Prepare the patty:
           Mix 200g of ground beef with salt and pepper. Form into a patty.
      `,
    },
  
    // FAQ 2: 
    {
      question: 'Block C will lack water for 2 days as repairs are done',
      answer: `The water supply to Block C has been interrupted for the past 3 days, making sanitation very difficult.`,
    },
  
    // FAQ 3: 
    {
        question: 'Wi-Fi problems in Library',
      answer: `Internet in the library wont be availabe on tuesday as repairs are done`,
    },
  
    // FAQ 4: 
    {
        question: 'Dirty Classrooms',
      answer: `Classrooms around block C will be harder to clean this week. Bear with us.`,
    }
  ];
  
  async function initData() {
    const insertStmt = db.prepare(`
      INSERT INTO faq (
        question,
        answer
      ) VALUES (
        @question,
        @answer
      )
  `);
  
  for (const FAQ of dummyFAQ) {
    insertStmt.run(FAQ);
  }
  
  console.log("Dummy FAQ inserted.");
  }
  
  initData();