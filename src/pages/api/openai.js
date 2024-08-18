import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body;
    console.log(prompt);

    try {
      const response = await axios.post('http://localhost:4891/v1/completions', {
        prompt,
        model:'Hermes',
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.5,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      res.status(200).json(response.data.choices[0].text);
    } catch (error) {
      console.error('Error in API:', error);
      res.status(500).json({ message: 'An error occurred while processing the request.', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}
