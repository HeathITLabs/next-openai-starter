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
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: message })
      });
      const data = await response.json();
      return data;
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
      document.body.classList.add('bg-background', 'text-foreground');
      document.body.classList.remove('bg-white', 'text-black');
    } else {
      setTheme('light');
      document.body.classList.add('bg-white', 'text-black');
      document.body.classList.remove('bg-background', 'text-foreground');
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-background text-foreground p-4">
      <div id='header' className="bg-card rounded-t-lg shadow-md">
        <h1 className="text-xl font-semibold">Chat Application</h1>
        <div className="" id='menu'>
          <button
            id="menu-button"
            className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80"
            onClick={toggleMenu}
          >
            <img aria-hidden="true" alt="hamburger-menu" src="" />
          </button>
          {menuVisible && (
            <div
              id="menu"
              className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg"
            >
              <button
                className="block px-4 py-2 text-foreground hover:bg-muted"
                onClick={toggleTheme}
              >
                Toggle Theme
              </button>
              <a href="#" className="block px-4 py-2 text-foreground hover:bg-muted">
                Account
              </a>
              <a href="#" className="block px-4 py-2 text-foreground hover:bg-muted">
                Settings
              </a>
              <a href="#" className="block px-4 py-2 text-foreground hover:bg-muted">
                Log In / Log Out
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div id='previousSessions' className="w-1/4 p-4 bg-card rounded-l-lg shadow-md overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Previous Sessions</h2>
          <div id="previous-sessions" className="space-y-2">
            {previousSessions.map((session) => (
              <div
                key={session.id}
                className="p-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80"
                onClick={() => handleSessionClick(session)}
              >
                {session.name}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col p-4 bg-card rounded-r-lg shadow-md">
          <div
            id="chat-messages"
            className="flex-1 overflow-y-auto space-y-4"
            ref={chatMessagesRef}
          >
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
          <div id='chatInterface' className="">
            <input
              id="user-input"
              type="text"
              className="p-2 border border-input rounded-l-lg focus:outline-none focus:ring focus:ring-primary"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              id="submit-button"
              className="bg-primary text-primary-foreground p-2 rounded-r-lg hover:bg-primary/80"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}