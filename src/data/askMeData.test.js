import { describe, expect, it } from 'vitest';
import { getAskMeAnswer } from './askMeData';

describe('portfolio guide social profiles', () => {
  it('answers social profile questions with the preserved Facebook and Instagram links', () => {
    const answer = getAskMeAnswer('Where can I follow you on social media?');

    expect(answer.topicId).toBe('social');
    expect(answer.answer).toContain('Facebook (jmsolyrs)');
    expect(answer.answer).toContain('Instagram (@jmsolyrs)');
    expect(answer.links).toEqual([
      { label: 'Facebook', href: 'https://www.facebook.com/jmsolyrs', external: true },
      { label: 'Instagram', href: 'https://www.instagram.com/jmsolyrs/?hl=en', external: true },
    ]);
  });

  it('can switch from contact details to an individual social profile', () => {
    const answer = getAskMeAnswer('How can I contact you on Instagram?', { previousTopicId: 'contact' });

    expect(answer.topicId).toBe('social');
    expect(answer.links.some(link => link.label === 'Instagram')).toBe(true);
  });
});
