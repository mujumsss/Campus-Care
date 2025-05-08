import db from "./src/lib/db.js";

const dummyGrievance = [
  // Grievance 1: has image only
  {
    user_id: 2,
    title: 'Test Grievance 1',
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
    image_path: '/images/burger.jpg',
    response: null,
  },

  // Grievance 2: has image and response
  {
    user_id: 2,
    title: 'Water Supply Interruption',
    content: `The water supply to Block C has been interrupted for the past 3 days, making sanitation very difficult.`,
    image_path: '/images/curry.jpg',
    response: 'Maintenance team has been dispatched. Issue expected to be resolved within 24 hours.',
  },

  // Grievance 3: response only
  {
    user_id: 3,
    title: 'Wi-Fi Issues in Library',
    content: `Internet in the library has been consistently slow, affecting research activities.`,
    image_path: null,
    response: 'IT Department upgraded routers this morning. Please check again.',
  },

  // Grievance 4: only mandatory fields
  {
    user_id: 3,
    title: 'Dirty Classrooms',
    content: `Classrooms in Old Wing are not cleaned regularly, especially after 4pm.`,
    image_path: null,
    response: null,
  }
];

async function initData() {
  const insertStmt = db.prepare(`
    INSERT INTO grievances (
      user_id,
      title,
      content,
      agree,
      disagree,
      response,
      image_path
    ) VALUES (
      @user_id,
      @title,
      @content,
      0,
      0,
      @response,
      @image_path
    )
  `);

  for (const grievance of dummyGrievance) {
    insertStmt.run(grievance);
  }

  console.log("Dummy grievances inserted.");
}

initData();