import db from './db';
import xss from 'xss';

export async function createFaq(faq) {
  faq.answer = xss(faq.answer);

  db.prepare(`
    INSERT INTO faq
    (question, answer)
    VALUES (
      @question,
      @answer
    )
    `).run({...faq});
}