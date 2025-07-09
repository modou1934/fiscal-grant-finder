
import React, { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

const Search = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex-shrink-0 page-header">
        <h1 className="page-title">Ricerca Bandi</h1>
        <p className="page-description">
          Utilizza l'assistente AI per trovare i bandi più adatti alle tue esigenze
        </p>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );

};

export default Search;
