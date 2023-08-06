import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Texts } from '../../enums/Texts';
import { IBlockGenericAPIFunctionParams } from '../../interfaces/external';
import { getSubscriptionUrl } from '../../lib/const';
import { getAccessTokenForUser } from '../../storage/users';

export async function deleteSubscription({context, data, room, read, persistence, modify, http }: IBlockGenericAPIFunctionParams) {
    const user: IUser = context.getInteractionData().user;
    const token = await getAccessTokenForUser(read, user);
    const board_id = context.getInteractionData().value;
    const headers = {
        Authorization: `Bearer ${token?.token}`,
    };
    const url = getSubscriptionUrl(board_id!);
    const response = await http.del(url, { headers });;

    if (response.statusCode == HttpStatusCode.NO_CONTENT) {
        const textSender = await modify.getCreator().startMessage().setText(Texts.deleteSubscriptionSuccess + response.data.message);
        if (room) {
            textSender.setRoom(room);
        }
    } else {
        const textSender = await modify.getCreator().startMessage().setText(Texts.deleteSubscriptionFailure + response.data.message);
    if (room) {
        textSender.setRoom(room);
    }
    await modify.getCreator().finish(textSender);
    }
}
