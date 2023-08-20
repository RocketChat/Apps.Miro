import { ApiEndpoint } from "@rocket.chat/apps-engine/definition/api";
import { IRead, IHttp, IModify, IPersistence, HttpStatusCode } from "@rocket.chat/apps-engine/definition/accessors";
import { IApiEndpointInfo, IApiRequest, IApiResponse } from "@rocket.chat/apps-engine/definition/api";
import { retrieveSubscribedUsersByBoardIdAsync } from "../storage/users";
import { sendDirectMessage } from "../lib/message";
import { MiscEnum } from "../enums/Misc";
import { processWebhookContent } from "../helpers/misc";

export class miroWebhook extends ApiEndpoint {
    public path = MiscEnum.API_INCOMING_ENDPOINT;
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const userReader = read.getUserReader();
        const payload: any = request.content;
        if (payload.challenge) return this.json({'content': payload, 'headers': {'content-type': 'application/json'}, 'status': HttpStatusCode.OK})
        let event = payload?.event
        let checkContent = event.item.data.content;
        if (!checkContent) return this.success();
        let board_id = payload?.event.boardId
        let itemType: string = payload?.event.item.type;
        const subscribedRCUsers = await retrieveSubscribedUsersByBoardIdAsync(read, board_id);
        switch(itemType) {
            case "sticky_note": case "text":
                let content: string = await processWebhookContent(read, checkContent);
                if (subscribedRCUsers && content.length > 0) {
                    for(let rocketChatUser of subscribedRCUsers){
                        const user = await userReader.getById(rocketChatUser.rcUserId);
                        const msg_to_user =
                        `Hello, ${user.name}!\n` +
                        `A new ${itemType.replace('_', ' ')} is added to the board you have subscribed #${board_id}, that says\n` +
                        content                       
                        await sendDirectMessage(read, modify, user, msg_to_user, persis);
                    }
                }
                return this.success()
            default:
                return this.success()  
        }
    }
}