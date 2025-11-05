import React, { useState, useEffect } from 'react';

const mockClients = [
  { id: 1, name: 'Alice Johnson', email: 'alice@client.com' },
  { id: 2, name: 'Bob Lee', email: 'bob@client.com' },
  { id: 3, name: 'Charlie Kim', email: 'charlie@client.com' },
  { id: 4, name: 'Diana Patel', email: 'diana@client.com' },
  { id: 5, name: 'Evan Smith', email: 'evan@client.com' },
  { id: 6, name: 'Fiona Green', email: 'fiona@client.com' },
  { id: 7, name: 'George Brown', email: 'george@client.com' },
  { id: 8, name: 'Hannah White', email: 'hannah@client.com' },
  { id: 9, name: 'Ian Black', email: 'ian@client.com' },
  { id: 10, name: 'Julia Adams', email: 'julia@client.com' },
  { id: 11, name: 'Kevin Turner', email: 'kevin@client.com' },
  { id: 12, name: 'Linda Scott', email: 'linda@client.com' },
  { id: 13, name: 'Michael Clark', email: 'michael@client.com' },
  { id: 14, name: 'Nina Lopez', email: 'nina@client.com' },
  { id: 15, name: 'Oscar Reed', email: 'oscar@client.com' },
  { id: 16, name: 'Paula Young', email: 'paula@client.com' },
  { id: 17, name: 'Quentin Hall', email: 'quentin@client.com' },
  { id: 18, name: 'Rachel Evans', email: 'rachel@client.com' },
  { id: 19, name: 'Sam Walker', email: 'sam@client.com' },
  { id: 20, name: 'Tina King', email: 'tina@client.com' },
  { id: 21, name: 'Uma Grant', email: 'uma@client.com' },
  { id: 22, name: 'Victor Price', email: 'victor@client.com' },
  { id: 23, name: 'Wendy Morris', email: 'wendy@client.com' },
  { id: 24, name: 'Xander Fox', email: 'xander@client.com' },
  { id: 25, name: 'Yara Bell', email: 'yara@client.com' },
  { id: 26, name: 'Zane Carter', email: 'zane@client.com' },
];

const AnnotationPrompt = ({ annotationPrompt, onSave, onCancel, currentUser }) => {
  const [draftText, setDraftText] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [clientQuery, setClientQuery] = useState('');
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState('');

  useEffect(() => {
    setDraftText(annotationPrompt.text);
  }, [annotationPrompt.text]);


  const handleClientSelect = (client) => {
    if (!selectedClients.some(c => c.id === client.id)) {
      setSelectedClients(prev => [...prev, client]);
    }
    setClientQuery('');
    setClientDropdownOpen(false);
  };

  const handleClientRemove = (clientId) => {
    setSelectedClients(prev => prev.filter(c => c.id !== clientId));
  };

  const handleSendNote = async () => {
    setSending(true);
    setSendStatus('');
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSendStatus(`Note sent to ${selectedClients.length} client(s).`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border-2 border-blue-500/50 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-white mb-4">
          {annotationPrompt.editingId ? 'Edit Annotation' : 'Add Annotation'}
        </h3>
        {/* Show original annotated text for review */}
        {annotationPrompt.selectedText && (
          <div className="mb-4">
            <div className="text-blue-400 text-xs font-semibold mb-2">Original Annotated Text:</div>
            <div className="bg-gray-700 text-white rounded-lg p-3 text-sm mb-2 border border-blue-500/30">{annotationPrompt.selectedText}</div>
          </div>
        )}
        <textarea
          className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your annotation here..."
          rows="3"
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
        />
        <div className="mb-4">
          <div className="text-blue-400 text-xs font-semibold mb-2">Send sales note to clients:</div>
          <div className="relative">
            <input
              type="text"
              className="w-full bg-gray-700 text-white rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search clients..."
              value={clientQuery}
              onChange={e => {
                setClientQuery(e.target.value);
                setClientDropdownOpen(true);
              }}
              onFocus={() => setClientDropdownOpen(true)}
              autoComplete="off"
            />
            {clientDropdownOpen && clientQuery.trim() && (
              <div className="absolute left-0 right-0 bg-gray-800 border border-blue-500/30 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                {mockClients.filter(client =>
                  client.name.toLowerCase().includes(clientQuery.toLowerCase()) ||
                  client.email.toLowerCase().includes(clientQuery.toLowerCase())
                ).length === 0 ? (
                  <div className="p-2 text-gray-400 text-sm">No clients found.</div>
                ) : (
                  mockClients.filter(client =>
                    client.name.toLowerCase().includes(clientQuery.toLowerCase()) ||
                    client.email.toLowerCase().includes(clientQuery.toLowerCase())
                  ).map(client => (
                    <div
                      key={client.id}
                      className="p-2 cursor-pointer hover:bg-blue-600 hover:text-white text-gray-300 text-sm"
                      onClick={() => handleClientSelect(client)}
                    >
                      {client.name} <span className="text-gray-500 text-xs">({client.email})</span>
                    </div>
                  ))
                )}
              </div>
            )}
            {/* Selected clients chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedClients.map(client => (
                <span key={client.id} className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  {client.name}
                  <button
                    type="button"
                    className="ml-1 text-white hover:text-red-400"
                    onClick={() => handleClientRemove(client.id)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        {sendStatus && (
          <div className="text-green-400 text-xs mb-2">{sendStatus}</div>
        )}
        <div className="flex justify-between items-center space-x-3">
          <button
            onClick={handleSendNote}
            disabled={sending || selectedClients.length === 0 || !draftText.trim()}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${sending || selectedClients.length === 0 || !draftText.trim() ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
          >
            {sending ? 'Sending...' : 'Send Note'}
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => onCancel()}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (draftText.trim()) {
                  onSave(draftText.trim());
                }
              }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              {annotationPrompt.editingId ? 'Update' : 'Add'} Annotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationPrompt;