import { Category, Post } from './types';

export const CATEGORIES = Object.values(Category);

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    type: 'text',
    title: 'How we scaled our organic farm output',
    content: 'We started using a new drip irrigation system that saved us 40% on water costs while increasing yield. The key was automating the schedule based on local weather data.',
    author: 'Sarah Jenkins',
    category: Category.AGRICULTURE,
    timestamp: Date.now() - 10000000,
    summary: 'A farmer shares advice on using drip irrigation automation to save water and increase yield.'
  },
  {
    id: '2',
    type: 'text',
    title: 'Customer retention in a small coffee shop',
    content: 'The secret isn\'t just good coffee, it is remembering names. We implemented a simple loyalty card but the real value was training staff to engage in genuine conversation.',
    author: 'Mike Ross',
    category: Category.HOSPITALITY,
    timestamp: Date.now() - 5000000,
    summary: 'Advice on using personal connection and loyalty programs to boost coffee shop retention.'
  },
  {
    id: '3',
    type: 'video',
    title: 'Inventory Management for Retail',
    content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // Placeholder video
    author: 'Elena Rodriguez',
    category: Category.RETAIL,
    timestamp: Date.now() - 2000000,
    summary: 'A visual walkthrough of organizing stockrooms for efficiency.'
  }
];
