import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getAskMeAnswer } from '../data/askMeData';

const MAX_QUESTION_LENGTH = 300;
const isMobileViewport = () => window.matchMedia('(max-width: 767px)').matches;
const reactionGifs = {
  friendly: { src: '/resources/gif%20replys/handshake.gif', webp: '/resources/gif%20replys/handshake.webp', alt: 'A friendly handshake' },
  pointing: { src: '/resources/gif%20replys/druski-pointing.gif', webp: '/resources/gif%20replys/druski-pointing.webp', alt: 'A man points toward the link' },
  shrug: { src: '/resources/gif%20replys/druski-shrug.gif', alt: 'A playful shrug' },
  error: { src: '/resources/gif%20replys/crash%20out.gif', alt: 'A dramatic reaction' },
};
const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  answer: 'Hey! Ask me about my projects, the tools I use, or anything else on this site.',
  suggestions: ['What have you built?', 'What tech do you use?', 'Tell me about AgapAI', 'How can I contact you?'],
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

function alignAnswerWithListStart(list, answer) {
  if (!list || !answer) return;
  const listRect = list.getBoundingClientRect();
  const answerRect = answer.getBoundingClientRect();
  const paddingTop = Number.parseFloat(window.getComputedStyle(list).paddingTop) || 0;
  const contentTop = listRect.top + list.clientTop + paddingTop;
  list.scrollTop += answerRect.top - contentTop;
}

function reactionFor(result, question, links, replyCount, fallbackCount) {
  if (result.id === 'runtime-error') return reactionGifs.error;
  if (result.id === 'fallback') return replyCount > 0 && fallbackCount % 2 === 1 ? reactionGifs.shrug : null;
  if (result.id === 'thanks' && replyCount > 0) return reactionGifs.friendly;
  if (links.length && /\b(demo|link|see|download|repo|website|contact)\b/i.test(question) && replyCount > 0 && replyCount % 3 === 0) return reactionGifs.pointing;
  return null;
}

function Message({ message, answerRef, onClose, onSuggestion, showSuggestions }) {
  const answer = typeof message.answer === 'string' ? message.answer : fallbackAnswer.answer;
  const paragraphs = answer.split('\n\n').filter(Boolean);
  const links = Array.isArray(message.links) ? message.links.filter(isAllowedLink) : [];
  const suggestions = showSuggestions && Array.isArray(message.suggestions)
    ? [...new Set(message.suggestions.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim()))].slice(0, 4)
    : [];

  return (
    <article className={`ask-message ask-message-${message.role}`}>
      <span className="ask-message-label">{message.role === 'assistant' ? 'portfolio guide' : 'you'}</span>
      <div ref={answerRef} className="ask-message-copy">
        {paragraphs.map((paragraph, index) => <p key={`${message.id}-paragraph-${index}`}>{paragraph}</p>)}
      </div>
      {links.length > 0 && <div className="ask-message-links" role="group" aria-label="Related links">
        {links.map(link => <a key={`${message.id}-${link.href}`} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined} onClick={onClose}>{link.label}<span aria-hidden="true"> ↗</span></a>)}
      </div>}
      {message.reaction && <div className="ask-message-reaction">
        <picture>
          {message.reaction.webp && <source srcSet={message.reaction.webp} type="image/webp" />}
          <img src={message.reaction.src} alt={message.reaction.alt} loading="lazy" decoding="async" />
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
  const latestAnswerRef = useRef(null);
  const messageSequence = useRef(0);
  const fallbackReactionSequence = useRef(0);
  const latestAssistantId = [...messages].reverse().find(message => message.role === 'assistant')?.id;

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const restoreFocus = previousFocus?.closest('[aria-hidden="true"]') ? document.querySelector('.menu-toggle') : previousFocus;
    document.documentElement.classList.add('overlay-open');
    document.body.classList.add('overlay-open');
    const focusFrame = window.requestAnimationFrame(() => {
      if (isMobileViewport()) panelRef.current?.focus();
      else inputRef.current?.focus();
    });
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
    if (!open) return undefined;

    const root = document.documentElement;
    const viewport = window.visualViewport;
    const updateVisualViewport = () => {
      root.style.setProperty('--ask-me-viewport-height', `${Math.round(viewport?.height || window.innerHeight)}px`);
      root.style.setProperty('--ask-me-viewport-top', `${Math.round(viewport?.offsetTop || 0)}px`);
    };

    updateVisualViewport();
    viewport?.addEventListener('resize', updateVisualViewport);
    viewport?.addEventListener('scroll', updateVisualViewport);
    window.addEventListener('resize', updateVisualViewport);

    return () => {
      viewport?.removeEventListener('resize', updateVisualViewport);
      viewport?.removeEventListener('scroll', updateVisualViewport);
      window.removeEventListener('resize', updateVisualViewport);
      root.style.removeProperty('--ask-me-viewport-height');
      root.style.removeProperty('--ask-me-viewport-top');
    };
  }, [open]);

  useLayoutEffect(() => {
    if (open) alignAnswerWithListStart(listRef.current, latestAnswerRef.current);
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
    try {
      result = getAskMeAnswer(trimmed, { previousTopicId });
    } catch {
      result = { ...fallbackAnswer, id: 'runtime-error' };
    }
    if (!result || typeof result.answer !== 'string' || !result.answer.trim()) {
      result = { ...fallbackAnswer, id: 'runtime-error' };
    }

    const links = Array.isArray(result.links) ? result.links.filter(isAllowedLink) : [];
    const suggestions = Array.isArray(result.suggestions)
      ? result.suggestions.filter(item => typeof item === 'string' && item.trim()).slice(0, 4)
      : welcomeMessage.suggestions;
    const fallbackCount = result.id === 'fallback' ? fallbackReactionSequence.current++ : 0;
    const reaction = reactionFor(result, trimmed, links, (messages.length - 1) / 2, fallbackCount);
    const sequence = `${Date.now()}-${messageSequence.current += 1}`;
    setMessages(current => [
      ...current,
      { id: `question-${sequence}`, role: 'user', answer: trimmed },
      { id: `answer-${sequence}`, role: 'assistant', topicId: typeof result.topicId === 'string' ? result.topicId : null, answer: result.answer, links, suggestions, reaction },
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
            answerRef={message.id === latestAssistantId ? latestAnswerRef : undefined}
            onClose={onClose}
            onSuggestion={suggestion => {
              const focusInput = !isMobileViewport();
              if (!focusInput) inputRef.current?.blur();
              ask(suggestion, { focusInput });
            }}
            showSuggestions={message.id === latestAssistantId}
          />)}
        </div>
        <form className="ask-me-form" onSubmit={event => { event.preventDefault(); ask(draft); }}>
          <div className="ask-me-compose-row">
            <input ref={inputRef} value={draft} onChange={event => { setDraft(event.target.value); setFormError(''); }} maxLength={MAX_QUESTION_LENGTH} placeholder="Ask me about my work…" aria-label="Ask a portfolio question" aria-describedby={`ask-me-hint${formError ? ' ask-me-error' : ''}`} autoComplete="off" />
            <button type="submit" aria-label="Send question">send <span aria-hidden="true">↗</span></button>
          </div>
          <div className="ask-me-form-meta"><span id="ask-me-hint">Answered locally · Enter to send</span><span aria-live="off">{draft.length}/{MAX_QUESTION_LENGTH}</span></div>
          {formError && <p id="ask-me-error" className="ask-me-error" role="alert">{formError}</p>}
        </form>
      </section>
    </div>
  );
}
