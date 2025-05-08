import fs from 'node:fs';
import slugify from 'slugify';
import db from './db';
import xss from 'xss';

export async function createNews(news) {
  news.content = xss(news.content);

  let imagePath = null;

  if (news.image && news.image.name) {
    const slug = slugify(news.title, { lower: true });

    const extension = news.image.name.split('.').pop();
    const fileName = `${slug}_${Math.random().toString(36).substring(2, 7)}.${extension}`;

    const stream = fs.createWriteStream(`public/news_images/${fileName}`);
    const bufferedImage = await news.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
      if (error) {
        throw new Error('Saving image failed!');
      }
    })
    imagePath = `/news_images/${fileName}`;
  }

  

  db.prepare(`
    INSERT INTO news
    (title, content, image_path)
    VALUES (
      @title,
      @content,
      @image_path
    )
    `).run({...news,
            image_path: imagePath
    });
}