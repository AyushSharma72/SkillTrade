const ChatBot = () => {
  return (
    <div className="webchat h-[600px] w-[400px] z-[100] absolute right-5 bottom-1">
      <iframe
        style={{ height: "100%", width: "100%", border: "none" }}
        srcDoc={`
          <!doctype html>
          <html lang="en">
            <head></head>
            <body>
              <script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>
              <script defer>
                window.botpress.on("webchat:ready", (conversationId) => {
                  botpress.open();
                });
                
                window.botpress.init({
                  "botId": "9d20dd1d-a9cd-447e-aaf3-a78f4fde92e5",
                  "configuration": {
                    "composerPlaceholder": "Ask Skill Bot! 😎",
                    "botName": "Skill Bot",
                    "botAvatar": "https://files.bpcontent.cloud/2025/01/19/11/20250119110053-GI67AVRT.png",
                    "botDescription": "Skill Bot is an intelligent chatbot designed to support users on the Skill Trade platform.",
                    "website": {},
                    "email": {
                      "title": "taskmaster991@gmail.com",
                      "link": "taskmaster991@gmail.com"
                    },
                    "phone": {},
                    "termsOfService": {},
                    "privacyPolicy": {},
                    "color": "#020202",
                    "variant": "soft",
                    "themeMode": "dark",
                    "fontFamily": "inter",
                    "radius": 1
                  },
                  "clientId": "ae827dc7-ac9b-42a3-9db0-727c0024ffc9"
                });
              </script>
            </body>
          </html>
        `}
      ></iframe>
    </div>
  );
};

export default ChatBot;
