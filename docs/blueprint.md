# **App Name**: LoginFlow

## Core Features:

- Tabbed Input: Implement tab-based navigation between Phone and Email/Username login options.
- Responsive Forms: Design a responsive login form adapting to desktop and mobile views.
- Error Handling: Provide clear and concise inline error messages for input validation.
- Geo Country: Add the country dropdown based on geolocation.
- Risk-based CAPTCHA: Protect the login feature against bots by integrating CAPTCHA challenge in login flow when triggered by LLM tool, if the login appears risky
- Legal Text: Include clear legal text with dynamic country settings and links to Terms of Service and Privacy Policy.

## Style Guidelines:

- Primary color: Use TikTok's brand red (#FE2C55) for key interactive elements like the Log In button to maintain brand consistency.
- Background color: Use a very light grey (#F0F2F5) for the page background to ensure legibility and a clean interface.
- Accent color: Use a slightly desaturated, brighter pink (#FF5F7A) as an accent, for example in the hover state of buttons and links.
- Body and headline font: 'PT Sans' (sans-serif) for a modern yet accessible typography across the login interface. Note: currently only Google Fonts are supported.
- Center the login form on both desktop and mobile views with a max-width of 400px for desktop. Implement full-width forms with stacked inputs on mobile devices for optimal touch interaction.
- Use subtle transitions for tab switching and form element interactions.