import { useState } from 'react';

const OpenAIComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    setOutput(data);
  };

  return (
    <div>
      <h1>Chat with Local Model</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Output</h2>
        <pre>{JSON.stringify(output, null, 2)}</pre>
      </div>
    </div>
  );
};

export default OpenAIComponent;
