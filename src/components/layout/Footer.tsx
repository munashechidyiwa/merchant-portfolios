
import React from 'react';

export function Footer() {
  const handleDeveloperClick = () => {
    // Create a simple about page or modal
    const aboutWindow = window.open('', '_blank', 'width=600,height=400');
    if (aboutWindow) {
      aboutWindow.document.write(`
        <html>
          <head>
            <title>About Developer</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #f5f5f5; }
              .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #333; margin-bottom: 20px; }
              p { color: #666; line-height: 1.6; }
              .contact { margin-top: 30px; }
              .contact a { color: #007bff; text-decoration: none; }
              .contact a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Munashe Chidyiwa</h1>
              <p>Full Stack Developer & System Architect</p>
              <p>Specialized in building robust business management systems and financial applications.</p>
              <div class="contact">
                <p>Connect with me:</p>
                <p>
                  <a href="mailto:munashe@example.com">Email</a> | 
                  <a href="https://linkedin.com/in/munashe-chidyiwa" target="_blank">LinkedIn</a> | 
                  <a href="https://github.com/munashe-chidyiwa" target="_blank">GitHub</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `);
      aboutWindow.document.close();
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-gray-600">
          Developed By{' '}
          <button
            onClick={handleDeveloperClick}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer bg-transparent border-none"
          >
            Munashe Chidyiwa
          </button>
        </div>
      </div>
    </footer>
  );
}
