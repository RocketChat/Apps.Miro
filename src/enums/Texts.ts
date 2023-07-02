export enum Texts {
    Help = `Miro App provides you the following slash commands, /miro-app:
    1) *help:* shows this list.
    2) *auth:* starts the process to authorize your Miro Account.`,
    Auth = 'auth',
    QuickReminder = 'Quick reminder: Let your workspace users know about the Miro App,\
    so everyone will be able to manage their boards as well.\n',
    Welcome = `Welcome to the Miro Rocket.Chat App!\n` +
        `To start managing your boards, notifications, etc. ` +
        `You first need to complete the app's setup and then authorize your Miro account.\n` +
        `To do so, type  \`/miro-app auth\`\n`,
    AuthSuccess = `The authentication process has succeeded! :tada:\n`,
    getBoardsFailure = '❗️ Unable to retrieve boards! \n Error ',
}
