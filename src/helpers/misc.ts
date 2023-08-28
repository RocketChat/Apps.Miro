import { IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { retrieveUserBymiroUserIdAsync } from "../storage/users";

export async function processWebhookContent(read: IRead, apiResponse: string): Promise<string> {
    const userIdRegex = /data-mention-id="(\d+)"/;

    const match = apiResponse.match(userIdRegex);
    if (!match) {
      return apiResponse.replace(/<[^>]+>/g, '');
    }
  
    const miroUserId = match[1];
    const userReader = read.getUserReader();
    const rocketChatUser = await retrieveUserBymiroUserIdAsync(read, miroUserId);
    let formattedResponse;
    if (rocketChatUser) {
        const user = await userReader.getById(rocketChatUser.rocketChatUserId);

        formattedResponse = apiResponse.replace(
            /<a class="mention" data-mention-id="\d+"[^>]*>.*?<\/a>/,
            `@${user.username}`
        );
    }
    else formattedResponse = apiResponse
      const cleanResponse = formattedResponse.replace(/<[^>]+>/g, '');

    return cleanResponse;
  }
  