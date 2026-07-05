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
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'rgba(168, 85, 247, 0.1)', borderLeft: '4px solid #a855f7', borderRadius: '0.5rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#a855f7', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>Retry Note</h4>
            <p style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{tagExplanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
