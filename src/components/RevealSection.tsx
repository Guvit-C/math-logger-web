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
                backgroundColor: retryTag === 'Failed' ? '#fee2e2' : retryTag === 'Mastered' ? '#dcfce3' : retryTag === 'Silly Mistake' ? '#fef9c3' : '#f3e8ff', 
                color: retryTag === 'Failed' ? '#ef4444' : retryTag === 'Mastered' ? '#22c55e' : retryTag === 'Silly Mistake' ? '#eab308' : '#9333ea', 
                border: `1px solid ${retryTag === 'Failed' ? '#ef4444' : retryTag === 'Mastered' ? '#22c55e' : retryTag === 'Silly Mistake' ? '#eab308' : '#d8b4fe'}` 
              }}
            >
              {retryTag === 'Failed' ? '❌ Failed' : retryTag === 'Mastered' ? '🎯 Mastered' : retryTag === 'Silly Mistake' ? '🤦 Silly Mistake' : retryTag}
            </span>
          )}
        </div>
        <div style={{ fontSize: '1.1rem' }}>
          <MarkdownViewer content={reason} />
        </div>
        
        {tagExplanation && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderLeft: '4px solid #94a3b8', borderRadius: '0.25rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Retry Note</h4>
            <p style={{ fontSize: '1rem', margin: 0, color: '#334155', whiteSpace: 'pre-wrap' }}>{tagExplanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
