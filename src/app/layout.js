import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: 'MorseType — Learn Morse Code Through Keyboard Practice',
  description: 'Minimal, modern Morse code typing practice inspired by Monkeytype. Master dots and dashes using your keyboard, track your WPM speed, accuracy, and learn International Morse code effortlessly.',
  keywords: ['Morse code', 'typing practice', 'Monkeytype', 'Morse learner', 'telegraph', 'ham radio', 'keyboard practice'],
  authors: [{ name: 'MorseType Team' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
