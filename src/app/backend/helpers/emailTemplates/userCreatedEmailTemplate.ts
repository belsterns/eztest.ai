const logoURL =
  "https://static.wixstatic.com/media/b88f70_b9e36bee94fa4a3c876ba990d7db089b~mv2.png/v1/fill/w_411,h_153,al_c,q_95,enc_avif,quality_auto/EZT.png";
const supportEmail = process.env.EMAIL_SUPPORT;

export const userCreatedEmailTemplate = (user: any, password?: string) => {
  const loginLink = password
    ? `${process.env.NEXTAUTH_URL}/login`
    : `${process.env.NEXTAUTH_URL}/domain/workspaces`;

  return ` 
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to EZTest AI</title>
<style>
  body { font-family: 'Work Sans', sans-serif; background-color: #f7f7f7; margin: 0; padding: 0; color: #333; }
  table { width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; border-collapse: collapse; border-radius: 5px; }
  .header { background-color: #2A2F42; color: #fff; text-align: center; padding: 20px 0; }
  .logo { display: block; margin: 0 auto; max-width: 200px; height: auto; }
  .content { padding: 20px; }
  .button { background-color: #2a2f42; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; }
  .footer { text-align: center; padding: 20px; background-color: #f8f8f8; font-size: 14px; }
</style>
</head>
<body>
<table>
  <tr><td class="header"><img src="${logoURL}" alt="EZTest AI Logo" class="logo"><h1>Welcome to EZTest AI</h1></td></tr>
  <tr><td class="content">
    <p>Hi ${user.full_name},</p>
    <p>We’re thrilled to have you on board! 🎉</p>
    ${password ? `<p><b>Your login credentials:</b></p><ul><li><b>Username:</b> ${user.email}</li><li><b>Password:</b> ${password}</li></ul>` : `<p>To get started, simply log in using the link below:</p>`}
    <p><a href="${loginLink}" class="button">Click here to login</a></p>
    <p>Need help? Contact <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
    <p>Best, The EZTest AI Team</p>
  </td></tr>
  <tr><td class="footer">Copyright © 2025 EZTest AI. All rights reserved.</td></tr>
</table>
</body>
</html>
`;
};
