import { useEffect, useRef, useState } from 'react';
import { getAskMeAnswer } from '../data/askMeData';

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  answer: 'Hi — ask me about my projects, skills, experience, résumé, or availability.',
};

function Message({ message, onClose }) {
  return (
    <div className={`ask-message ask-message-${message.role}`}>
      <span className="ask-message-label">{message.role === 'assistant' ? 'answer' : 'you'}</span>
      <div className="ask-message-copy">
        {message.answer.split('\n\n').map((paragraph, index) => <p key={`${message.id}-paragraph-${index}`}>{paragraph}</p>)}
      </div>
      {message.links?.length > 0 && <div className="ask-message-links">
        {message.links.map(link => <a key={`${message.id}-${link.href}`} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined} onClick={onClose}>{link.label} <span aria-hidden="true">↗</span></a>)}
      </div>}
    </div>
  );
}

export default function AskMe({ open, onClose }) {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [draft, setDraft] = useState('');
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('overlay-open');
    window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => document.body.classList.remove('overlay-open');
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const ask = question => {
    const trimmed = question.trim();
    if (!trimmed) return;
    const answer = getAskMeAnswer(trimmed);
    const now = Date.now();
    setMessages(current => [...current, { id: `question-${now}`, role: 'user', answer: trimmed }, { id: `${answer.id}-${now}`, role: 'assistant', answer: answer.answer, links: answer.links }]);
    setDraft('');
  };

  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === 'Tab' && panelRef.current) {
      const focusable = [...panelRef.current.querySelectorAll('button, input, a[href]')].filter(element => !element.disabled);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };

  if (!open) return null;

  return (
    <div className="ask-me-layer" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section ref={panelRef} className="ask-me-panel" role="dialog" aria-modal="true" aria-labelledby="ask-me-title" onKeyDown={handleKeyDown}>
        <header className="ask-me-header">
          <div><span className="ask-me-kicker">portfolio assistant</span><h2 id="ask-me-title">what do you want to ask?</h2></div>
          <button type="button" className="ask-me-close" onClick={onClose} aria-label="Close Ask me">×</button>
        </header>
        <div ref={listRef} className="ask-message-list" aria-live="polite">
          {messages.length === 1
            ? <p className="sr-only">{messages[0].answer}</p>
            : messages.map(message => <Message key={message.id} message={message} onClose={onClose} />)}
        </div>
        <form className="ask-me-form" onSubmit={event => { event.preventDefault(); ask(draft); }}>
          <input ref={inputRef} value={draft} onChange={event => setDraft(event.target.value)} placeholder="" aria-label="Ask a portfolio question" />
          <button type="submit" aria-label="Send question">send ↗</button>
        </form>
      </section>
    </div>
  );
}
