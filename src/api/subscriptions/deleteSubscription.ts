import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Texts } from '../../enums/Texts';
import { IBlockGenericAPIFunctionParams } from '../../interfaces/external';
import { getSubscriptionUrl } from '../../lib/const';
import { Subscription } from '../../storage/subscriptions';

export async function deleteSubscription({ app, context, data, room, read, persistence, modify, http }: IBlockGenericAPIFunctionParams) {
    const user: IUser = context.getInteractionData().user;
    const token = await app.getOauth2ClientInstance().getAccessTokenForUser(user);
    const subscription_id = context.getInteractionData().value;
    const headers = {
        Authorization: `Bearer ${token?.token}`,
    };
    const url = getSubscriptionUrl(subscription_id!);
    const response = await http.del(url, { headers });;
    if (response.statusCode == HttpStatusCode.NO_CONTENT || response.statusCode == HttpStatusCode.NOT_FOUND) {
        const textSender = await modify.getCreator().startMessage().setText(Texts.deleteSubscriptionSuccess);
        if (room) {
            textSender.setRoom(room);
        }
        await modify.getCreator().finish(textSender);
        let subscriptionStorage = new Subscription(app, persistence!, read.getPersistenceReader());
        await subscriptionStorage.deleteSubscription(subscription_id!)
    } else {
        const textSender = await modify.getCreator().startMessage().setText(Texts.deleteSubscriptionFailure + response.data.message);
    if (room) {
        textSender.setRoom(room);
    }
    await modify.getCreator().finish(textSender);
    }
}
