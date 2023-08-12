import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { MiscEnum } from '../../enums/Misc';
import { ModalsEnum } from '../../enums/Modals';
import { Texts } from '../../enums/Texts';
import { ISubmitGenericAPIFunctionParams } from '../../interfaces/external';
import { getWebhookSubscriptionUrl, getWebhookUrl } from '../../lib/const';
import { getAccessTokenForUser, retrieveUserByRocketChatUserIdAsync } from '../../storage/users';
import { Subscription } from '../../storage/subscriptions';

export async function createSubscription({ app, context, data, room, read, persistence, modify, http }: ISubmitGenericAPIFunctionParams) {
    const state = data.view.state;
    const user: IUser = context.getInteractionData().user;
    const token = await app.getOauth2ClientInstance().getAccessTokenForUser(user);
    const board_id = state?.[ModalsEnum.BOARD_ID_BLOCK]?.[ModalsEnum.BOARD_ID_INPUT];
    const board_name = state?.[ModalsEnum.BOARD_NAME_BLOCK]?.[ModalsEnum.BOARD_NAME_INPUT];
    const accessors = app?.getAccessors();
    const callbackUrl = await getWebhookUrl(accessors!, MiscEnum.API_INCOMING_ENDPOINT);
    console.log(state)
    const headers = {
        Authorization: `Bearer ${token?.token}`,
    };
    const body = {
        boardId: board_id,
        callbackUrl,
        status: "enabled"
    };
    const url = getWebhookSubscriptionUrl();
    const response = await http.post(url, { headers, data: body });

    if (response.statusCode == HttpStatusCode.CREATED) {
        let data: any = response.data;
        let webhookId = data.id;
        let boardId = data.data.boardId;
        let rcUser = await retrieveUserByRocketChatUserIdAsync(read, user.id);
        const textSender = await modify.getCreator().startMessage().setText(Texts.createSubscriptionSuccess);
        if (room) {
            textSender.setRoom(room);
        }
        await modify.getCreator().finish(textSender);
        let subscriptionStorage = new Subscription(persistence, read.getPersistenceReader());
        await subscriptionStorage.createSubscription(board_name, boardId, webhookId, user.id, rcUser?.miroUserId!);
    } else {
        const textSender = await modify.getCreator().startMessage().setText(Texts.createSubscriptionFailure + response.data.message);
    if (room) {
        textSender.setRoom(room);
    }
    await modify.getCreator().finish(textSender);
    }
}
