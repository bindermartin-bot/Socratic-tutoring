export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen erlaubt' });
  }

  try {
    const { prompt, image } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    // OpenAI erwartet Text und Bild separat in einem Array
    let messageContent = [{ type: 'text', text: prompt }];
    
    if (image) {
      messageContent.push({
        type: 'image_url',
        image_url: { url: image }
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: messageContent }],
        temperature: 0.3
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
