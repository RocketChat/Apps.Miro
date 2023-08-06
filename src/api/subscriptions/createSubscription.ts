import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { MiscEnum } from '../../enums/Misc';
import { ModalsEnum } from '../../enums/Modals';
import { Texts } from '../../enums/Texts';
import { ISubmitGenericAPIFunctionParams } from '../../interfaces/external';
import { getWebhookSubscriptionUrl, getWebhookUrl } from '../../lib/const';
import { getAccessTokenForUser } from '../../storage/users';

export async function createSubscription({app, context, data, room, read, persistence, modify, http }: ISubmitGenericAPIFunctionParams) {
    const state = data.view.state;
    const user: IUser = context.getInteractionData().user;
    const token = await getAccessTokenForUser(read, user);
    const board_id = state?.[ModalsEnum.BOARD_ID_BLOCK]?.[ModalsEnum.BOARD_ID_INPUT];
    const accessors = app?.getAccessors();
    const callbackUrl = getWebhookUrl(accessors!, MiscEnum.API_INCOMING_ENDPOINT);
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
        const textSender = await modify.getCreator().startMessage().setText(Texts.createSubscriptionSuccess + response.data.message);
        if (room) {
            textSender.setRoom(room);
        }
    } else {
        const textSender = await modify.getCreator().startMessage().setText(Texts.createSubscriptionFailure + response.data.message);
    if (room) {
        textSender.setRoom(room);
    }
    await modify.getCreator().finish(textSender);
    }
}
