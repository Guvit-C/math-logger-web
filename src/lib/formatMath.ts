export function formatChatGPTMath(text: string): string {
  if (!text) return text;
  
  return text
    // Replace inline math: \( ... \) with $ ... $
    .replace(/\\\(([\s\S]*?)\\\)/g, (match, p1) => `$${p1}$`)
    // Replace block math: \[ ... \] with $$ ... $$
    .replace(/\\\[([\s\S]*?)\\\]/g, (match, p1) => `$$$$${p1}$$$$`);
}
