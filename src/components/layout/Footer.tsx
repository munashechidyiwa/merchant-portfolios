
import React from 'react';

export function Footer() {
  const handleDeveloperClick = () => {
    // Create a detailed about page with correct contact information
    const aboutWindow = window.open('', '_blank', 'width=700,height=600');
    if (aboutWindow) {
      aboutWindow.document.write(`
        <html>
          <head>
            <title>About Developer - Munashe Chidyiwa</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #333;
              }
              
              .container { 
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                padding: 60px 40px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                text-align: center;
                max-width: 500px;
                width: 90%;
                transform: translateY(0);
                animation: slideIn 0.6s ease-out;
              }
              
              @keyframes slideIn {
                from { transform: translateY(-30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              
              .header {
                margin-bottom: 40px;
                animation: fadeIn 0.8s ease-out 0.2s both;
              }
              
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              h1 { 
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 10px;
                letter-spacing: -0.5px;
              }
              
              .subtitle {
                color: #666;
                font-size: 1.2rem;
                font-weight: 500;
                margin-bottom: 15px;
              }
              
              .description {
                color: #555;
                line-height: 1.6;
                font-size: 1rem;
                margin-bottom: 40px;
              }
              
              .contact-section {
                animation: fadeIn 1s ease-out 0.4s both;
              }
              
              .contact-title {
                color: #333;
                font-size: 1.3rem;
                font-weight: 600;
                margin-bottom: 25px;
              }
              
              .contact-links {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-bottom: 35px;
                flex-wrap: wrap;
              }
              
              .contact-link {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 12px 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 500;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
              }
              
              .contact-link:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                text-decoration: none;
                color: white;
              }
              
              .contact-link:active {
                transform: translateY(-1px) scale(1.02);
              }
              
              .phone-section {
                border-top: 2px solid #eee;
                padding-top: 30px;
                animation: fadeIn 1.2s ease-out 0.6s both;
              }
              
              .phone-label {
                color: #666;
                font-size: 1rem;
                margin-bottom: 15px;
                font-weight: 500;
              }
              
              .phone-numbers {
                font-size: 1.8rem;
                font-weight: 700;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                line-height: 1.4;
                animation: pulse 2s ease-in-out infinite;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
              }
              
              .phone-separator {
                margin: 8px 0;
                color: #999;
                font-size: 1.2rem;
              }
              
              .close-btn {
                position: absolute;
                top: 20px;
                right: 25px;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #999;
                cursor: pointer;
                transition: color 0.3s ease;
              }
              
              .close-btn:hover {
                color: #667eea;
              }
              
              @media (max-width: 600px) {
                .container { padding: 40px 20px; }
                h1 { font-size: 2rem; }
                .contact-links { gap: 15px; }
                .contact-link { padding: 10px 16px; font-size: 0.9rem; }
                .phone-numbers { font-size: 1.5rem; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <button class="close-btn" onclick="window.close()">&times;</button>
              
              <div class="header">
                <h1>Munashe Chidyiwa</h1>
                <div class="subtitle">Full Stack Developer & System Architect</div>
                <div class="description">
                  Specialized in building robust business management systems and financial applications with modern web technologies.
                </div>
              </div>
              
              <div class="contact-section">
                <div class="contact-title">Let's Connect</div>
                
                <div class="contact-links">
                  <a href="mailto:chidyiwamunashe@gmail.com" class="contact-link">
                    📧 Email
                  </a>
                  <a href="https://linkedin.com/in/munashe-chidyiwa" target="_blank" class="contact-link">
                    💼 LinkedIn
                  </a>
                  <a href="https://github.com/munashe-chidyiwa" target="_blank" class="contact-link">
                    🔗 GitHub
                  </a>
                </div>
                
                <div class="phone-section">
                  <div class="phone-label">Direct Contact</div>
                  <div class="phone-numbers">
                    +263 776 124 769
                    <div class="phone-separator">•</div>
                    +263 717 477 494
                  </div>
                </div>
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
