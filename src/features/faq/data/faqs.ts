export interface Faq {
  id: string
  question: string
  /** Placeholder for now — real answers will be filled in later. */
  answer: string
}

const PLACEHOLDER_ANSWER =
  'Answer goes here — this is placeholder copy to be replaced with the real response.'

export const FAQS: readonly Faq[] = [
  {
    id: 'subscription',
    question: 'How does the subscription work?',
    answer:
      'You get instant access to the entire lesson library, plus 4 new lessons every month.',
  },
  {
    id: 'level',
    question: 'What level are the lessons for?',
    answer: PLACEHOLDER_ANSWER,
  },
  {
    id: 'included',
    question: 'What’s included in a lesson?',
    answer: PLACEHOLDER_ANSWER,
  },
  {
    id: 'trial',
    question: 'Can I try before I subscribe?',
    answer: PLACEHOLDER_ANSWER,
  },
  {
    id: 'google-slides',
    question: 'Do I need Google Slides?',
    answer: PLACEHOLDER_ANSWER,
  },
  {
    id: 'cancel',
    question: 'Can I cancel anytime?',
    answer: PLACEHOLDER_ANSWER,
  },
  {
    id: 'available',
    question: 'How many lessons are available right now?',
    answer: PLACEHOLDER_ANSWER,
  },
]
