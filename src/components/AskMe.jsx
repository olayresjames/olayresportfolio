import { useEffect, useRef, useState } from 'react';
import { getAskMeAnswer } from '../data/askMeData';

const MAX_QUESTION_LENGTH = 300;
const reactionGifs = {
  friendly: { src: '/resources/gif%20replys/handshake.gif', webp: '/resources/gif%20replys/handshake.webp', alt: 'A man offers a casual handshake' },
  pointing: { src: '/resources/gif%20replys/druski-pointing.gif', webp: '/resources/gif%20replys/druski-pointing.webp', alt: 'A man points toward the viewer' },
  clarify: { src: '/resources/gif%20replys/what%20do%20you%20mean%20by%20that.gif', webp: '/resources/gif%20replys/what%20do%20you%20mean%20by%20that.webp', alt: 'A man gives a skeptical look beneath the words “what do you mean by that?”' },
  shrug: { src: '/resources/gif%20replys/druski-shrug.gif', alt: 'A man shrugs while another person looks on' },
  error: { src: '/resources/gif%20replys/crash%20out.gif', alt: 'A man reacts dramatically while holding a drink' },
};
const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  answer: 'Hi — I’m the portfolio guide. Ask about a project, a technology, experience, or how to get in touch.',
  suggestions: ['What projects have you built?', 'What is in your tech stack?', 'Tell me about AgapAI', 'How can I contact you?'],
  reaction: reactionGifs.friendly,
};
const fallbackAnswer = {
  answer: 'I hit a snag while preparing that answer. Please try rephrasing it, or choose one of these topics.',
  suggestions: welcomeMessage.suggestions,
};

function isAllowedLink(link) {
  if (!link || typeof link.href !== 'string' || typeof link.label !== 'string') return false;
  return link.href.startsWith('#') || (link.href.startsWith('/') && !link.href.startsWith('//') && !link.href.startsWith('/\\')) || link.href.startsWith('mailto:') || (link.external && /^https?:\/\//i.test(link.href));
}

function reactionFor(result, links, failed, fallbackVariant = 0) {
  if (result.id === 'fallback') {
    const useShrug = fallbackVariant % 2 === 1;
    return {
      ...(useShrug ? reactionGifs.shrug : reactionGifs.clarify),
      auto: true,
      caption: useShrug ? "I don’t know about that, bro 😅" : 'Me trying to connect that to my portfolio:',
    };
  }
  if (failed || result.id === 'runtime-error') return reactionGifs.error;
  if (['greeting', 'thanks'].includes(result.id)) return reactionGifs.friendly;
  if (result.id === 'input-error') return reactionGifs.shrug;
  return links.length > 0 ? reactionGifs.pointing : null;
}

function Message({ message, onClose, onReactionLoad, onSuggestion, showSuggestions }) {
  const answer = typeof message.answer === 'string' ? message.answer : fallbackAnswer.answer;
  const paragraphs = answer.split('\n\n').filter(Boolean);
  const links = Array.isArray(message.links) ? message.links.filter(isAllowedLink) : [];
  const suggestions = showSuggestions && Array.isArray(message.suggestions)
    ? [...new Set(message.suggestions.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim()))].slice(0, 4)
    : [];

  return (
    <article className={`ask-message ask-message-${message.role}`}>
      <span className="ask-message-label">{message.role === 'assistant' ? 'portfolio guide' : 'you'}</span>
      {message.reaction?.auto && <div className="ask-message-reaction ask-message-reaction-auto">
        <p className="ask-message-reaction-caption">{message.reaction.caption}</p>
        <picture>
          {message.reaction.webp && <source srcSet={message.reaction.webp} type="image/webp" />}
          <img src={message.reaction.src} alt={message.reaction.alt} loading="lazy" decoding="async" onLoad={onReactionLoad} />
        </picture>
      </div>}
      <div className="ask-message-copy">
        {paragraphs.map((paragraph, index) => <p key={`${message.id}-paragraph-${index}`}>{paragraph}</p>)}
      </div>
      {links.length > 0 && <div className="ask-message-links" role="group" aria-label="Related links">
        {links.map(link => <a key={`${message.id}-${link.href}`} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined} onClick={onClose}>{link.label}<span aria-hidden="true"> ↗</span></a>)}
      </div>}
      {message.reaction && !message.reaction.auto && <div className="ask-message-reaction">
        <picture>
          {message.reaction.webp && <source srcSet={message.reaction.webp} type="image/webp" />}
          <img src={message.reaction.src} alt={message.reaction.alt} loading="lazy" decoding="async" onLoad={onReactionLoad} />
        </picture>
      </div>}
      {suggestions.length > 0 && <div className="ask-suggestions" role="group" aria-label="Suggested questions">
        {suggestions.map(suggestion => <button key={suggestion} type="button" onClick={() => onSuggestion(suggestion)}>{suggestion}<span aria-hidden="true"> ↗</span></button>)}
      </div>}
    </article>
  );
}

export default function AskMe({ open, onClose }) {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [draft, setDraft] = useState('');
  const [formError, setFormError] = useState('');
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const messageSequence = useRef(0);
  const fallbackReactionSequence = useRef(0);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const restoreFocus = previousFocus?.closest('[aria-hidden="true"]') ? document.querySelector('.menu-toggle') : previousFocus;
    document.documentElement.classList.add('overlay-open');
    document.body.classList.add('overlay-open');
    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.documentElement.classList.remove('overlay-open');
      document.body.classList.remove('overlay-open');
      if (restoreFocus?.isConnected && restoreFocus.getClientRects().length > 0) {
        window.requestAnimationFrame(() => restoreFocus.focus());
      }
    };
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const ask = (question, { focusInput = false } = {}) => {
    if (typeof question !== 'string') {
      setFormError('I couldn’t read that question. Please try again.');
      return;
    }
    const trimmed = question.trim();
    if (!trimmed) {
      setFormError('Type a question or choose one of the suggested prompts.');
      inputRef.current?.focus();
      return;
    }
    if (trimmed.length > MAX_QUESTION_LENGTH) {
      setFormError(`Please keep your question to ${MAX_QUESTION_LENGTH} characters or fewer.`);
      inputRef.current?.focus();
      return;
    }

    const previousTopicId = [...messages].reverse().find(message => message.role === 'assistant' && message.topicId)?.topicId;
    let result;
    let failed = false;
    try {
      result = getAskMeAnswer(trimmed, { previousTopicId });
    } catch {
      result = { ...fallbackAnswer, id: 'runtime-error' };
      failed = true;
    }
    if (!result || typeof result.answer !== 'string' || !result.answer.trim()) {
      result = { ...fallbackAnswer, id: 'runtime-error' };
      failed = true;
    }

    const links = Array.isArray(result.links) ? result.links.filter(isAllowedLink) : [];
    const suggestions = Array.isArray(result.suggestions)
      ? result.suggestions.filter(item => typeof item === 'string' && item.trim()).slice(0, 4)
      : welcomeMessage.suggestions;
    const sequence = `${Date.now()}-${messageSequence.current += 1}`;
    const fallbackVariant = result.id === 'fallback' ? fallbackReactionSequence.current++ : 0;
    setMessages(current => [
      ...current,
      { id: `question-${sequence}`, role: 'user', answer: trimmed },
      { id: `answer-${sequence}`, role: 'assistant', topicId: typeof result.topicId === 'string' ? result.topicId : null, answer: result.answer, links, suggestions, reaction: reactionFor(result, links, failed, fallbackVariant) },
    ]);
    setDraft('');
    setFormError('');
    if (focusInput) window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const resetChat = () => {
    setMessages([welcomeMessage]);
    fallbackReactionSequence.current = 0;
    setDraft('');
    setFormError('');
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === 'Enter' && event.target === inputRef.current) {
      event.preventDefault();
      event.currentTarget.querySelector('form')?.requestSubmit();
      return;
    }
    if (event.key === 'Tab' && panelRef.current) {
      const focusable = [...panelRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href]')]
        .filter(element => element.getClientRects().length > 0);
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

  const latestAssistantId = [...messages].reverse().find(message => message.role === 'assistant')?.id;

  return (
    <div className="ask-me-layer" role="presentation" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={panelRef} className="ask-me-panel" role="dialog" aria-modal="true" aria-labelledby="ask-me-title" tabIndex={-1} onKeyDown={handleKeyDown}>
        <header className="ask-me-header">
          <div className="ask-me-title-copy">
            <h2 id="ask-me-title">what do you want to know?</h2>
          </div>
          <div className="ask-me-header-actions">
            {messages.length > 1 && <button type="button" className="ask-me-reset" onClick={resetChat}>new chat</button>}
            <button type="button" className="ask-me-close" onClick={onClose} aria-label="Close portfolio guide">×</button>
          </div>
        </header>
        <div ref={listRef} className="ask-message-list" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
          {messages.map(message => <Message
            key={message.id}
            message={message}
            onClose={onClose}
            onReactionLoad={message.id === latestAssistantId ? () => {
              const list = listRef.current;
              if (!list || list.scrollHeight - list.scrollTop - list.clientHeight > 240) return;
              window.requestAnimationFrame(() => { list.scrollTop = list.scrollHeight; });
            } : undefined}
            onSuggestion={suggestion => ask(suggestion, { focusInput: true })}
            showSuggestions={message.id === latestAssistantId}
          />)}
        </div>
        <form className="ask-me-form" onSubmit={event => { event.preventDefault(); ask(draft); }}>
          <div className="ask-me-compose-row">
            <input ref={inputRef} value={draft} onChange={event => { setDraft(event.target.value); setFormError(''); }} maxLength={MAX_QUESTION_LENGTH} placeholder="Ask about a project, skill, or experience…" aria-label="Ask a portfolio question" aria-describedby={`ask-me-hint${formError ? ' ask-me-error' : ''}`} autoComplete="off" />
            <button type="submit" aria-label="Send question">send <span aria-hidden="true">↗</span></button>
          </div>
          <div className="ask-me-form-meta"><span id="ask-me-hint">Portfolio details only · Enter to send</span><span aria-live="off">{draft.length}/{MAX_QUESTION_LENGTH}</span></div>
          {formError && <p id="ask-me-error" className="ask-me-error" role="alert">{formError}</p>}
        </form>
      </section>
    </div>
  );
}
