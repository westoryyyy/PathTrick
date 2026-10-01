const Groq = require('groq-sdk');
require('dotenv').config();

async function test() {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: 'You are a JSON helper.' }, { role: 'user', content: 'Output {"test": "ok"}' }],
      model: 'openai/gpt-oss-120b',
      response_format: { type: "json_object" },
      max_tokens: 50
    });
    console.log(completion.choices[0].message.content);
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }
}
test();
