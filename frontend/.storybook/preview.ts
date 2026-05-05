import type { Preview } from '@storybook/react-vite';
import 'highlight.js/styles/github.css';

// Geist Mono
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap';
document.head.appendChild(link);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;