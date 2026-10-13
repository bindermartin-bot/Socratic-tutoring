export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen erlaubt' });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.OPENAI_API_KEY; // Zieht den Schlüssel sicher aus Vercel

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3 // Etwas niedriger für logischere, fokussiertere Antworten
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      res.status(200).json({ status: 'success', response: data.choices[0].message.content });
    } else {
      res.status(500).json({ status: 'error', error: data.error.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
}
