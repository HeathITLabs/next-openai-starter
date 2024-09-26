import { useState, useRef } from 'react';

export default function ChatInterface() {
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [theme, setTheme] = useState('light');
  const chatMessagesRef = useRef(null);

  const previousSessions = [
    { id: 1, name: 'Session 1', messages: ['Hello', 'Hi there!'] },
    { id: 2, name: 'Session 2', messages: ['How are you?', 'I am fine, thank you!'] },
  ];

  const handleSessionClick = (session) => {
    setChatMessages(session.messages);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const newMessages = [...chatMessages, userInput];
    setChatMessages(newMessages);
    setUserInput('');

    const modelResponse = await getModelResponse(userInput);
    setChatMessages([...newMessages, modelResponse]);

    // Scroll to the bottom of the chat
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  };

  const getModelResponse = async (message) => {
    try {
      const response = await fetch('/api/localllm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await response.json();
      if (response.ok) {
        return data.text;
      } else {
        console.error('Error from API:', data.message);
        return `Error: ${data.message}`;
      }
    } catch (error) {
      console.error('Error fetching model response:', error);
      return 'Error fetching model response';
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.body.classList.add('dark');
    } else {
      setTheme('light');
      document.body.classList.remove('dark');
    }
  };

  return (
    <div className="container">
      <div className="message-container" ref={chatMessagesRef}>
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg self-start ${
              index % 2 === 0
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-accent text-accent-foreground'
            }`}
          >
            {message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          id="user-input"
          type="text"
          className="user-input"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          id="submit-button"
          className=""
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
  
}


