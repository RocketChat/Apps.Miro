import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Texts } from '../../enums/Texts';
import { IBlockGenericAPIFunctionParams } from '../../interfaces/external';
import { getSubscriptionUrl } from '../../lib/const';
import { getAccessTokenForUser } from '../../storage/users';
import { Subscription } from '../../storage/subscriptions';

export async function deleteSubscription({context, data, room, read, persistence, modify, http }: IBlockGenericAPIFunctionParams) {
    const user: IUser = context.getInteractionData().user;
    const token = await getAccessTokenForUser(read, user);
    const subscription_id = context.getInteractionData().value;
    const headers = {
        Authorization: `Bearer ${token?.token}`,
    };
    const url = getSubscriptionUrl(subscription_id!);
    const response = await http.del(url, { headers });;

    if (response.statusCode == HttpStatusCode.NO_CONTENT) {
        let subscriptionStorage = new Subscription(persistence, read.getPersistenceReader());
        subscriptionStorage.deleteSubscription(subscription_id!)
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
