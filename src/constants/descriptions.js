/**
 * PERSONAL_DESCRIPTIONS
 *
 * Maps employee name (lowercase) → their personal story.
 * When a team member's resolved name matches a key here,
 * this description is shown instead of the generic role description.
 */
export const PERSONAL_DESCRIPTIONS = {
  'bhup singh': `For 25 years, I've been making patterns that bring garments to life. I started this journey to create a better future for my children, and that purpose still drives me today.`,

  'sah mohammad miyan': `I've been stitching since childhood and working professionally since 1990. After all these years, it's a craft I know like the back of my hand.`,

  'dilshad': `I've never stayed at one workplace for more than a few months, but I've been here for 2 years. The work, the friendships, and the daily conversations make this place feel different.`,

  'shailendar': `Stitching is a skill I'll carry with me for as long as I can. When you put your heart into your work, it gives you a sense of purpose every day.`,

  'mahesh': `I've been with Qurvii since day one. I cut and sew garments, turning fabric into clothes people will wear. It makes me proud to see Qurvii reach new heights every day.`,

  'sudhan': `I've been working in garment cutting for 10 years. Originally from Pilibhit, I enjoy the precision and focus that goes into preparing every piece before it reaches the sewing floor.`,

  'rizwan mohammad': `I've been working in garment cutting for 5 years and have been with Qurvii for the past year. I enjoy fashion and like to always look well dressed and presentable.`,

  'subhash cutting master': `I love working out, so my day starts at the gym at 6 AM before I head to work at 9. That routine keeps me energized, focused, and ready for the day.`,

  'vikash kumar': `For 15 years, I've worked as a tailor. But whenever I visit my village in Bihar, you'll usually find me out in the fields, doing the work I grew up around.`,

  'ranjeet': `I learned stitching from my father at the age of 10 and have been doing it for 25 years. It's a skill that runs through my family and has been part of my life for as long as I can remember.`,

  'safi alam': `After 27 years in stitching, I'm now working toward a dream I've had for years: building my own small business.`,

  'raju': `I've been working as a pressman for 13 years. No matter the task, I'm always ready to step in and help wherever I'm needed.`,

  'pooja': `I like challenging stereotypes and taking on tasks that are usually seen as men's work. I'm also passionate about social media and dream of building my own audience someday.`,

  'bindu': `Handwork has taught me patience and attention to detail. Outside of work, I love cooking and am always excited to try new recipes, from regional dishes to Indian sweets.`,
};

/**
 * Look up a personal description by name (case-insensitive).
 * Returns null if no personal description found.
 */
export function getPersonalDescription(name) {
  if (!name) return null;
  return PERSONAL_DESCRIPTIONS[name.toLowerCase().trim()] ?? null;
}
