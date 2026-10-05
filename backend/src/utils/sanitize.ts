// A simple sanitizer using custom regex.
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

export const sanitizePromptInjection = (text: string): string => {
  if (!text) return '';
  // Basic prompt injection mitigation: strip markdown code blocks and system prompt delimiters
  return text
    .replace(/```/g, '')
    .replace(/system:/ig, 's_ystem:')
    .replace(/user:/ig, 'u_ser:')
    .replace(/assistant:/ig, 'a_ssistant:')
    .replace(/<\|im_start\|>/g, '')
    .replace(/<\|im_end\|>/g, '');
};

export const sanitizeTextInput = (text: string): string => {
  return sanitizePromptInjection(sanitizeHtml(text));
};
