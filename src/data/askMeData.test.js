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

describe('portfolio guide conversation', () => {
  it('keeps project answers focused and follows the same project through another question', () => {
    const overview = getAskMeAnswer('Tell me about Point Nemo');
    const followUp = getAskMeAnswer('How does it handle PDFs?', { previousTopicId: overview.topicId });

    expect(overview.topicId).toBe('point-nemo');
    expect(overview.answer.length).toBeLessThan(300);
    expect(followUp.topicId).toBe('point-nemo');
    expect(followUp.answer).toMatch(/PDF|document/i);
    expect(followUp.answer.length).toBeLessThan(350);
  });

  it('answers a focused role question without dumping the full case study', () => {
    const answer = getAskMeAnswer('What was your role?', { previousTopicId: 'agapai' });
    expect(answer.topicId).toBe('agapai');
    expect(answer.answer).toMatch(/tech lead|developer/i);
    expect(answer.answer.length).toBeLessThan(320);
  });

  it('filters projects by a requested technology', () => {
    const answer = getAskMeAnswer('Which projects use React?');
    expect(answer.topicId).toBe('projects');
    expect(answer.answer).toContain('Point Nemo');
    expect(answer.answer).not.toContain('Sword Phantasia');
    const projectOnlyTechnology = getAskMeAnswer('Which projects use Java?');
    expect(projectOnlyTechnology.answer).toContain('Legend Of Cee');
    expect(projectOnlyTechnology.answer).not.toContain('Point Nemo');
  });

  it('does not claim an unlisted technology for a named project', () => {
    const answer = getAskMeAnswer('Does Point Nemo use Firebase?');
    expect(answer.topicId).toBe('point-nemo');
    expect(answer.answer).toMatch(/don.t see Firebase listed/i);
  });

  it('understands project acronyms and compares two named projects', () => {
    expect(getAskMeAnswer('Tell me about PNP IDTMS').topicId).toBe('pnp-idtms');
    const comparison = getAskMeAnswer('Compare Point Nemo and AgapAI');
    expect(comparison.answer).toContain('Point Nemo');
    expect(comparison.answer).toContain('AgapAI');
    expect(comparison.answer.length).toBeLessThan(421);
  });

  it('switches from a project follow-up to a new personal topic', () => {
    const answer = getAskMeAnswer('How can I contact you?', { previousTopicId: 'point-nemo' });
    expect(answer.topicId).toBe('contact');
    expect(answer.links.some(link => link.href.startsWith('mailto:'))).toBe(true);
  });

  it('answers an unrelated question honestly', () => {
    const answer = getAskMeAnswer('What is the weather in Manila today?');
    expect(answer.id).toBe('fallback');
    expect(answer.answer).toMatch(/don.t have a reliable answer/i);
  });
});
