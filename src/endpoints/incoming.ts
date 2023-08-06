import { ApiEndpoint } from "@rocket.chat/apps-engine/definition/api";
import { IRead, IHttp, IModify, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { IApiEndpointInfo, IApiEndpoint, IApiRequest, IApiResponse } from "@rocket.chat/apps-engine/definition/api";
import { retrieveSubscribedUsersByBoardIdAsync, retrieveUserBymiroUserIdAsync } from "../storage/users";
import { sendDirectMessage } from "../lib/message";
import { MiscEnum } from "../enums/Misc";

export class miroWebhooks extends ApiEndpoint {
    public path = MiscEnum.API_INCOMING_ENDPOINT;
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const creator = modify.getCreator();
        const userReader = read.getUserReader();
        const payload: any = request.content;
        let eventType: string = payload?.eventType;
        let messageText = "newEvent !";
        switch(eventType) {
            case "board_subscription":
                let event = payload?.event
                let board_id = event.boardId
                messageText =  `Task assignees have been changed, use get-tasks command to Edit assignees.`
                let new_assignee_id = payload?.history_items[0]?.after?.id
                const subscribedRCUsers = await retrieveSubscribedUsersByBoardIdAsync(read, board_id);
                if (subscribedRCUsers) {
                    for(let rocketChatUser of subscribedRCUsers){
                        const user = await userReader.getById(
                            rocketChatUser.rocketChatUserId
                        );
                        const msg_to_user =
                        `Hello, ${user.name}!\n` +
                        `There are some changes to the board you have subscribed #${board_id}`                       
                        await sendDirectMessage(read, modify, user, msg_to_user, persis);
                    }
                }
                break;
            default:
                break;

        }
        return this.success();
    }
}