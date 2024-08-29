import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body;
    try {
      const response = await axios.post('http://localhost:1234/v1/chat/completions', {
        model: 'TheBloke/TheBlokeOrca-2-7B-GGUF/orca-2-7b.Q4_K_M.gguf',
        messages: [
          { role: 'system', content: 'You are a helpful writing assistant' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response.data.choices[0].message.content);  
      res.status(200).json({ text: response.data.choices[0].message.content });
    } catch (error) {
      console.error('Error in API:', error);
      res.status(500).json({ message: 'An error occurred while processing the request.', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}