// Generates a short, satirical 4-line "complaint" about a fictional Greggs visit.
// Purely for entertainment purposes - not a real complaint submission tool.

const OPENERS = [
  'I am writing to express my utter dismay at my recent visit to Greggs.',
  "I've never been so let down by a bakery in my entire life.",
  'What happened at your store this morning was, frankly, unforgivable.',
  'I demand answers about the state of my lunch order today.',
  'As a loyal customer for over a decade, I expected far better.',
  'My whole afternoon was ruined by what I experienced at Greggs.',
];

const FOOD_ISSUES = [
  'the steak bake was somehow both cold in the middle and radioactive on the outside',
  'the pasty had the structural integrity of a wet paper bag',
  'my sausage roll arrived looking like it had been sat on',
  'the pizza slice was so soggy it folded like a taco',
  'the vegan sausage roll had suspiciously non-vegan sausage in it',
  'the yum yum was distinctly lacking in both yum and yum',
  'my coffee was lukewarm and tasted faintly of gravy',
  'the doughnut had approximately one (1) sprinkle on it',
];

const STAFF_ISSUES = [
  'the worker behind the till sighed so loudly I thought he was in labour',
  'the staff member rolled her eyes when I asked for a bag',
  'nobody acknowledged me for a full six minutes despite the shop being empty',
  'the cashier appeared to be personally offended by my order',
  'the man on the tills called my order "boring" to my face',
  'I was told to "just wait" and then promptly ignored',
];

const CLOSERS = [
  'I expect a full refund and a written apology, ideally laminated.',
  'This is simply not the Greggs standard I have come to expect.',
  'I will be taking my custom to Gregg\u2019s rival bakery from now on.',
  'Frankly, my nan makes a better pasty, and she\u2019s been dead six years.',
  'I hope this message reaches whoever is responsible for this travesty.',
  'Yours in disappointment, a once-loyal customer.',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Local, offline complaint generator - no API key required.
 * Always returns exactly 4 lines.
 */
function generateLocalComplaint() {
  const opener = pick(OPENERS);
  const food = `To make matters worse, ${pick(FOOD_ISSUES)}.`;
  const staff = `On top of that, ${pick(STAFF_ISSUES)}.`;
  const closer = pick(CLOSERS);
  return [opener, food, staff, closer].join('\n');
}

/**
 * AI-powered complaint generator using the OpenAI API.
 * Falls back to the local generator on any failure.
 */
async function generateAIComplaint() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return generateLocalComplaint();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You write short, silly, over-the-top FICTIONAL customer complaints about a bakery called Greggs, purely for comedic entertainment in a Discord server. Never target real, named individuals. Keep it lighthearted, exaggerated, and clearly fictional.',
          },
          {
            role: 'user',
            content:
              'Write a funny, exaggerated fictional complaint about a bad Greggs experience. Exactly 4 lines, no more, no less. No numbering, no markdown, just 4 plain lines of prose. Make it dramatic and petty about food quality and/or service.',
          },
        ],
        max_tokens: 200,
        temperature: 1,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, await response.text());
      return generateLocalComplaint();
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) return generateLocalComplaint();
    return text;
  } catch (err) {
    console.error('Failed to generate AI complaint, using local fallback:', err);
    return generateLocalComplaint();
  }
}

async function generateComplaint() {
  if (process.env.OPENAI_API_KEY) {
    return generateAIComplaint();
  }
  return generateLocalComplaint();
}

module.exports = { generateComplaint, generateLocalComplaint };
