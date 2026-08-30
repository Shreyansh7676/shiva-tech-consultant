import DOMPurify from 'dompurify';

const sanitizeOptions = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'colspan', 'rowspan']
};

export const sanitizeRichHtml = (html) => DOMPurify.sanitize(html || '', sanitizeOptions);

export default function RichContent({ html, className = '' }) {
  return <div className={`rich-content ${className}`} dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(html) }} />;
}
