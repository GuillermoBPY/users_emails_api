const validationMessage = (url) => {
  const htmlText = `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Email Validation</title>
  </head>
  <body>
      <div style="width: 400px; margin: 30px auto; background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
          <h1 style="text-align: center; color: #333;">Email Validation</h1>
          <p style="color: #666; line-height: 1.5; margin-bottom: 20px;">Dear User,</p>
          <p style="color: #666; line-height: 1.5; margin-bottom: 20px;">Thank you for signing up! To validate your email address, please click on the button below:</p>
          <p style="text-align: center;">
              <a href="${url}" target="_blank" style="display: inline-block; background-color: #4CAF50; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 3px;">Verify Email</a>
          </p>
          <p style="color: #666; line-height: 1.5; margin-bottom: 20px;">If you did not sign up for this service, please ignore this email.</p>
          <p style="color: #666; line-height: 1.5; margin-bottom: 20px;">Thank you!</p>
          <p style="color: #666; line-height: 1.5; margin-bottom: 20px;">Best regards,</p>
          <p style="color: #666; line-height: 1.5; margin-bottom: 20px;">GUILLERMOBPY</p>
      </div>
  </body>
  </html>`;

  return htmlText;
};

module.exports = validationMessage;
