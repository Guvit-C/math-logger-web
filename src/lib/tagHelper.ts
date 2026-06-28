export function encodeReasonWithTag(reason: string, tag: string) {
  // Strip existing tag if any
  const stripped = stripTagFromReason(reason);
  if (!tag) return stripped;
  return `[TAG:${tag}]\n${stripped}`;
}

export function parseReasonAndTag(reason: string): { tag: string; actualReason: string } {
  if (!reason) return { tag: '', actualReason: '' };
  const match = reason.match(/^\[TAG:(.+?)\]\n([\s\S]*)$/);
  if (match) {
    return { tag: match[1], actualReason: match[2] };
  }
  return { tag: '', actualReason: reason };
}

export function stripTagFromReason(reason: string): string {
  return parseReasonAndTag(reason).actualReason;
}
