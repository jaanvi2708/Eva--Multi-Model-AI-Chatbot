'use client';

import { useState } from 'react';

export default function Chatbot() {
  const [selectedModel, setSelectedModel] = useState<'groq' | 'claude' | 'openai'>('groq');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Demo History
  const [chatHistory] = useState([
    { id: 1, title: "C++ Mini Calculator", time: "2 hours ago" },
    { id: 2, title: "React Project Ideas", time: "Yesterday" },
    { id: 3, title: "Interview Preparation", time: "2 days ago" },
  ]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const aiReply = data.text || 'No response received';
      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  const loadChat = (id: number) => {
    setMessages([]);
    alert(`Loading conversation #${id}... (Full feature coming soon)`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex overflow-hidden">

      {/* Smooth Sliding Sidebar */}
      <div 
        className={`bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-500 ease-out overflow-hidden shadow-xl
          ${isSidebarOpen ? 'w-72' : 'w-20'}`}
      >
        {/* Logo + Eva Header */}
        <div className="p-6 flex items-center gap-3 border-b border-zinc-800">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-300">
            ✨
          </div>
          
          <div className={`overflow-hidden transition-all duration-500 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <h1 className="text-2xl font-semibold tracking-tight">Eva</h1>
            <p className="text-xs text-zinc-500 -mt-1">AI Assistant</p>
          </div>
        </div>

        {/* History Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-3 px-6 py-5 hover:bg-zinc-800 active:bg-zinc-700 transition-all group text-left w-full"
        >
          <span className="text-2xl transition-transform duration-300">📜</span>
          <span className={`font-medium text-zinc-300 group-hover:text-white transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            History
          </span>
        </button>

        {/* History Content with Smooth Animation */}
        <div className={`flex-1 overflow-hidden transition-all duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          {isSidebarOpen && (
            <div className="p-6 pt-2 overflow-y-auto h-full">
              <div className="space-y-3">
                {chatHistory.map((chat, index) => (
                  <div
                    key={chat.id}
                    onClick={() => loadChat(chat.id)}
                    className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <p className="text-sm font-medium line-clamp-1">{chat.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">{chat.time}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={clearChat}
                className="mt-10 w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-sm font-medium transition-all active:scale-95"
              >
                + New Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-4xl mx-auto w-full p-6 flex-1 flex flex-col">

          {/* Model Selector */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <button 
              onClick={() => setSelectedModel('groq')}
              className={`px-8 py-3 rounded-2xl font-medium transition-all ${selectedModel === 'groq' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
            >
              ⚡ Groq • Fast
            </button>

            <button 
              onClick={() => setSelectedModel('claude')}
              className={`px-8 py-3 rounded-2xl font-medium transition-all ${selectedModel === 'claude' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
            >
              🧠 Claude • Advanced
            </button>

            <button 
              onClick={() => setSelectedModel('openai')}
              className={`px-8 py-3 rounded-2xl font-medium transition-all ${selectedModel === 'openai' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
            >
              🌟 OpenAI • GPT
            </button>
          </div>

          {/* Chat Box - 50vh */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex-1 overflow-y-auto mb-8 shadow-2xl min-h-[50vh]">
            
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-6xl mb-8">
                  ✨
                </div>
                <h2 className="text-4xl font-semibold mb-4">Hi, I'm Eva</h2>
                <p className="text-zinc-400 max-w-md">
                  Your intelligent AI companion.<br />
                  Powered by Groq, Claude & OpenAI.
                </p>
              </div>
            )}

            {messages.map((m, index) => (
              <div key={index} className={`mb-8 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-7 py-5 rounded-3xl text-[16px] leading-relaxed
                  ${m.role === 'user' 
                    ? 'bg-violet-600 text-white rounded-br-none' 
                    : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700'}`}>
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start mb-8">
                <div className="bg-zinc-800 px-7 py-5 rounded-3xl rounded-bl-none flex items-center gap-4 border border-zinc-700">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce delay-300"></div>
                  </div>
                  <span className="text-zinc-400">Eva is thinking...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-950/70 border border-red-900 text-red-400 p-5 rounded-2xl text-center">
                {error}
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={onSubmit} className="flex gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Eva..."
              className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-violet-500 rounded-3xl px-7 py-5 text-base outline-none transition-all placeholder:text-zinc-500"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-800 px-12 rounded-3xl font-semibold text-base transition-all disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}