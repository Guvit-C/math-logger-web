'use client';

import { useState } from 'react';
import MarkdownViewer from './MarkdownViewer';

export default function RevealSection({ 
  reason, 
  retryTag, 
  tagExplanation 
}: { 
  reason: string; 
  retryTag: string; 
  tagExplanation: string | null;
}) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <button 
        onClick={() => setRevealed(true)}
        className="btn"
        style={{ marginTop: '2rem', padding: '1rem 2rem', fontSize: '1.2rem', width: '100%', maxWidth: '500px', alignSelf: 'center' }}
      >
        {retryTag ? "Reveal Explanation & Retry Tag" : "Reveal Explanation"}
      </button>
    );
  }

  return (
    <div style={{ width: '100%', marginTop: '2rem', animation: 'fadeIn 0.3s ease-in-out' }}>
      <div className="question-reason-box">
        <div className="question-reason-title">
          What went wrong
          {retryTag && (
            <span 
              className="tag" 
              style={{ 
                marginLeft: '1rem', 
                backgroundColor: retryTag === 'Failed' ? '#fee2e2' : retryTag === 'Mastered' ? '#dcfce3' : '#fef9c3', 
                color: retryTag === 'Failed' ? '#ef4444' : retryTag === 'Mastered' ? '#22c55e' : '#eab308', 
                border: `1px solid ${retryTag === 'Failed' ? '#ef4444' : retryTag === 'Mastered' ? '#22c55e' : '#eab308'}` 
              }}
            >
              {retryTag === 'Failed' ? '❌ Failed' : retryTag === 'Mastered' ? '🎯 Mastered' : '🤦 Silly Mistake'}
            </span>
          )}
        </div>
        <div style={{ fontSize: '1.1rem' }}>
          <MarkdownViewer content={reason} />
        </div>
        
        {tagExplanation && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border-color)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Tag Explanation:</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-color)' }}>{tagExplanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
