import fs from 'node:fs';

import slugify from 'slugify';
import db from './db';
import xss from 'xss';

// Fetches all grievances, useful for the general /feeds page
export function getGrievances() {
  return db.prepare(`
    SELECT * FROM grievances
    ORDER BY created_at DESC
  `).all();
}

// Fetches grievances for a specific user (e.g., for /my_feeds)
export function getGrievanceByUserId(user_id) {
  return db.prepare(`
    SELECT * FROM grievances
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(user_id);
}

//creates grievance for a specific user
export async function createGrievance(grievance) {

  grievance.content = xss(grievance.content);

  let imagePath = null;

  if (grievance.image && grievance.image.name) {
    const slug = slugify(grievance.title, { lower: true });

    const extension = grievance.image.name.split('.').pop();
    const fileName = `${slug}_${Math.random().toString(36).substring(2, 7)}.${extension}`;

    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await grievance.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
      if (error) {
        throw new Error('Saving image failed!');
      }
    })
    imagePath = `/images/${fileName}`;
  }

  

  db.prepare(`
    INSERT INTO grievances
    (user_id, title, content, image_path)
    VALUES (
      @user_id,
      @title,
      @content,
      @image_path
    )
    `).run({...grievance,
            image_path: imagePath
    });
}