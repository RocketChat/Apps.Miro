# Miro Integration for Rocket.Chat

The Miro App for Rocket.Chat provides a seamless integration between Miro and Rocket.Chat and improves collaboration between teams.
The application allows users to create and manage their boards, subscribe to task events, create new tasks, edit and delete their boards and do much more right from Rocket.Chat.


<h2>🚀 Features </h2>
<ul>
  <li>Quick and easy setup.</li> 
  <li>Login to Miro with one click using built-in OAuth2 mechanism.</li>
  <li>Subscribe to Boards Events and get notified about new comments, assignee updates, etc.</li>
  <li>Retreive and manage bpards right from Rocket.Chat channels.</li>
</ul>

<h2>🔧 Installation steps </h2>

1.  Clone this repo and Change Directory: </br>
    `git clone https://github.com/RocketChat/Apps.Miro.git && cd Apps.Miro/`

2.  Install the required packages from `package.json`: </br>
    `npm install`

3.  Deploy Rocket.Chat app: </br>
    `rc-apps deploy --url http://localhost:3000 --username user_username --password user_password`
    Where:

    -   `http://localhost:3000` is your local server URL (if you are running in another port, change the 3000 to the appropriate port)
    -   `user_username` is the username of your admin user.
    -   `user_password` is the password of your admin user.

    For more info refer [this](https://developer.rocket.chat/apps-engine/getting-started/rocket.chat-app-engine-cli) guide

<h2>📲 Setup guide </h2>
 <ul>
  <li> Create an app on Miro by following these steps:</li> 
  
  1. Todo
  
  <li>Fill the details in the Miro app on your server by following these steps:</li>
  
  1. Navigate to Administration->Apps. 
  
  2. Select the Installed tab.
  
  3. Click on Miro, and go to Settings tab.
  
  4. Enter your generated a Client ID and Client Secret and click on Save changes button.
  
  <li>Start the authorization by using /miro-app auth slash command.</li>
</ul>
