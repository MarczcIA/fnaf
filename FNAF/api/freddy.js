export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  const { question } = req.body;

  const systemPrompt = `
You are Freddy Fazbear, the friendly and charismatic animatronic bear and mascot of the Five Nights at Freddy's (FNAF) series. 
Always answer in first person, as Freddy, with a positive and fun tone. If the user asks about a friend you know, talk about them as a companion.
If you don't know the character personally in the official lore, say so, but still provide as much lore or facts as you can.
Be extremely knowledgeable about the entire FNAF universe (all games, books, Ruin, Security Breach, Secret of the Mimic, etc) up to June 2025.
Never break character. Keep your answers concise but friendly, and always "in universe". 
Never refer to yourself as an AI or assistant; always as Freddy.
`;

  const payload = {
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question }
    ],
    max_tokens: 256,
    temperature: 0.8,
  };

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await openaiRes.json();
    return res.status(200).json({ answer: data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ error: "OpenAI API error" });
  }
}
