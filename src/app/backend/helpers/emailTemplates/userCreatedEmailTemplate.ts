const logoURL =
  "https://static.wixstatic.com/media/b88f70_b9e36bee94fa4a3c876ba990d7db089b~mv2.png/v1/fill/w_411,h_153,al_c,q_95,enc_avif,quality_auto/EZT.png";
const supportEmail = process.env.EMAIL_SUPPORT;

export const userCreatedEmailTemplate = (user: any, password?: string) => {
  const loginLink = password
    ? `${process.env.NEXTAUTH_URL}/login`
    : `${process.env.NEXTAUTH_URL}/workspaces`;

  return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to EZTest AI</title>
          <style>
            body {
              font-family: 'Work Sans', sans-serif;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .header {
              background-color: #2A2F42;
              color: #ffffff;
              text-align: center;
              padding: 30px 20px;
            }
            .logo {
              max-width: 180px;
              margin-bottom: 15px;
            }
            .content {
              padding: 25px 30px;
              line-height: 1.6;
            }
            .content p {
              margin: 0 0 15px;
            }
            .button {
              display: inline-block;
              background-color: #2A2F42;
              color: #ffffff;
              padding: 12px 24px;
              margin: 20px 0;
              text-decoration: none;
              border-radius: 5px;
              font-weight: 500;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 13px;
              background-color: #f0f0f0;
              color: #666;
            }
            ul {
              padding-left: 20px;
            }

            @media (max-width: 600px) {
              .content {
                padding: 20px;
              }
              .button {
                display: block;
                width: 100%;
                text-align: center;
              }
            }
          </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="${logoURL}" alt="EZTest AI Logo" class="logo">
                <h1>Welcome to EZTest AI</h1>
              </div>
              <div class="content">
                <p>Hi ${user.full_name},</p>
                <p>We’re thrilled to have you on board! 🎉</p>
                ${
                  password
                    ? `<p><strong>Your login credentials:</strong></p>
                      <ul>
                        <li><strong>Username:</strong> ${user.email}</li>
                        <li><strong>Password:</strong> ${password}</li>
                      </ul>
                      <p>We recommend changing your password after logging in for security.</p>`
                    : `<p>To get started, simply log in using the link below:</p>`
                }
                <p><a href="${loginLink}" class="button">Access Your Account</a></p>
                <p>Need help? Reach us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
                <p>Welcome aboard,<br><strong>The EZTest AI Team</strong></p>
              </div>
              <div class="footer">
                &copy; 2025 EZTest AI. All rights reserved.
              </div>
            </div>
          </body>
          </html>
          `;
};
