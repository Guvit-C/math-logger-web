'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarkdownViewer from '@/components/MarkdownViewer';

export default function WeaknessNotePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [weaknessId, setWeaknessId] = useState<string>('');
  const [weakness, setWeakness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    params.then(p => {
      setWeaknessId(p.id);
      fetch('/api/weaknesses')
        .then(res => res.json())
        .then(data => {
          const found = data.weaknesses?.find((w: any) => w.id === p.id);
          if (found) {
            setWeakness(found);
            setEditNotes(found.notes || '');
          }
          setLoading(false);
        });
    });
  }, [params]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/weaknesses/${weaknessId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editNotes }),
      });
      if (res.ok) {
        setWeakness({ ...weakness, notes: editNotes });
        setIsEditing(false);
      } else {
        alert('Failed to save notes');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving notes');
    }
    setSaving(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Weakness Note...</div>;
  }

  if (!weakness) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2>Weakness not found</h2>
        <Link href="/weaknesses" className="btn" style={{ marginTop: '1rem' }}>Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="weakness-page" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/weaknesses" style={{ color: 'var(--text-secondary)' }}>&larr; Back to Weaknesses</Link>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="tag" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-secondary)' }}>{weakness.topic}</span>
            {weakness.subtopic && <span className="tag" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-secondary)' }}>{weakness.subtopic}</span>}
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: 0 }}>{weakness.title}</h1>
        </div>
        <div>
          {!isEditing ? (
            <button className="btn" onClick={() => setIsEditing(true)}>✎ Edit Obsidian Note</button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Notes'}</button>
              <button className="btn btn-secondary" onClick={() => { setIsEditing(false); setEditNotes(weakness.notes || ''); }}>Cancel</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Use Markdown and KaTeX ($...$) to format your detailed mathematical notes.</p>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              style={{
                width: '100%',
                minHeight: '600px',
                padding: '1.5rem',
                fontSize: '1rem',
                fontFamily: 'monospace',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
                border: '1px solid var(--primary-color)',
                borderRadius: '0.5rem',
                resize: 'vertical'
              }}
              placeholder="Write your Obsidian-style notes here..."
            />
          </div>
        ) : (
          <div className="obsidian-note-preview" style={{ 
            backgroundColor: 'var(--bg-color)', 
            padding: '2rem', 
            borderRadius: '0.5rem', 
            minHeight: '400px',
            border: '1px solid var(--border-color)',
            fontSize: '1.1rem'
          }}>
            {weakness.notes ? (
              <MarkdownViewer content={weakness.notes} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem' }}>
                <p>No detailed notes written yet.</p>
                <button className="btn" onClick={() => setIsEditing(true)} style={{ marginTop: '1rem' }}>Write your first note</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
