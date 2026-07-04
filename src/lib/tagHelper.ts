export function encodeReasonWithTag(reason: string, tag: string, note?: string) {
  let finalReason = stripTagFromReason(reason);
  if (note) finalReason = `[NOTE:${note}]\n${finalReason}`;
  if (tag) finalReason = `[TAG:${tag}]\n${finalReason}`;
  return finalReason;
}

export function parseReasonAndTag(reason: string): { tag: string; note: string; actualReason: string } {
  if (!reason) return { tag: '', note: '', actualReason: '' };
  
  let currentReason = reason;
  
  const tagMatch = currentReason.match(/^\[TAG:(.+?)\](?:\r?\n)?/);
  const tag = tagMatch ? tagMatch[1] : '';
  if (tagMatch) currentReason = currentReason.replace(tagMatch[0], '');
  
  const noteMatch = currentReason.match(/^\[NOTE:([\s\S]+?)\](?:\r?\n)?/);
  const note = noteMatch ? noteMatch[1] : '';
  if (noteMatch) currentReason = currentReason.replace(noteMatch[0], '');
  
  return { tag, note, actualReason: currentReason };
}

export function stripTagFromReason(reason: string): string {
  return parseReasonAndTag(reason).actualReason;
}
