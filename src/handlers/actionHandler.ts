import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUIKitResponse, UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { MiscEnum } from '../enums/Misc';
import { deleteBoard } from '../api/boards/deleteBoard';
import { getBoardDataById, shareBoard } from '../api/boards/getSpecificBoard';
import { getUIData } from '../lib/persistence';
import { MiroApp } from '../../MiroApp';
import { addBoardMembersModal } from '../modals/boardMembers/addBoardMembersModal';
import { addSubscriptionModal } from '../modals/subscription/addSubscription';
import { manageSubscriptionsModal } from '../modals/subscription/manageSubscriptions';
import { ModalsEnum } from '../enums/Modals';
import { deleteSubscriptionModal } from '../modals/subscription/deleteSubscription';
import { deleteSubscription } from '../api/subscriptions/deleteSubscription';
import { editBoardModal } from '../modals/boards/editBoardModal';
import { embedBoardToRoom, removeEmbeddedBoardFromRoom } from '../api/boards/getoEmbedData';

export class ExecuteBlockActionHandler {
    constructor(
        public readonly app: MiroApp,
        public readonly read: IRead,
        public readonly http: IHttp,
        public readonly modify: IModify,
        public readonly persistence: IPersistence,
    ) {}

    public async run(context: UIKitBlockInteractionContext): Promise<IUIKitResponse> {
        const triggerId = context.getInteractionData().triggerId;
        const data = context.getInteractionData();
        const { actionId, user } = data;
        let uiData = (await getUIData(this.read.getPersistenceReader(), user.id)) || {};
        const room = uiData.room;
        const roomId = uiData.room?.id;

        try {
            switch (actionId) {
                case MiscEnum.ADD_BOARD_MEMBERS_ACTION_ID:
                    const members_modal = await addBoardMembersModal({ context, read: this.read });
                    await this.modify.getUiController().openSurfaceView(members_modal, {triggerId}, user);
                    return context.getInteractionResponder().successResponse();
                case MiscEnum.SHARE_BOARD_ACTION_ID:
                    await shareBoard({ app: this.app, context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
                    return context.getInteractionResponder().successResponse();
                case MiscEnum.EDIT_BOARD_ACTION_ID:
                    let board_data = await getBoardDataById({ app: this.app, context, read: this.read, http: this.http})
                    const edit_board_modal = await editBoardModal({ app: this.app, context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http, extra: board_data });
                    await this.modify.getUiController().openSurfaceView(edit_board_modal, {triggerId}, user);
                    return context.getInteractionResponder().successResponse();
                case MiscEnum.DELETE_BOARD_ACTION_ID:
                    await deleteBoard({ app: this.app, context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
                    return context.getInteractionResponder().successResponse();
                case MiscEnum.SUBSCRIBE_BOARD_ACTION_ID:
                    const subscriptionModal = await addSubscriptionModal({ app: this.app, modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http, uikitcontext: context, data });
                    return context.getInteractionResponder().openModalViewResponse(subscriptionModal);
                case MiscEnum.EMBED_BOARD_ACTION_ID:
                    await embedBoardToRoom({ app: this.app, modify: this.modify, read: this.read, persistence: this.persistence, data, room });
                    return context.getInteractionResponder().successResponse();
                case MiscEnum.REMOVE_BOARD_EMBEDDING_ACTION_ID:
                    await removeEmbeddedBoardFromRoom({ app: this.app, modify: this.modify, read: this.read, persistence: this.persistence, data, room });
                    return context.getInteractionResponder().successResponse();
                case ModalsEnum.OPEN_ADD_SUBSCRIPTIONS_MODAL:
                    const openSubscriptionModal = await addSubscriptionModal({ app: this.app, modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http, uikitcontext: context, data });
                    return context.getInteractionResponder().openModalViewResponse(openSubscriptionModal);
                case ModalsEnum.OPEN_DELETE_SUBSCRIPTIONS_MODAL:
                    const deleteSubscriptionmodal = await deleteSubscriptionModal({ app: this.app, modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http, uikitcontext: context, data });
                    return context.getInteractionResponder().openModalViewResponse(deleteSubscriptionmodal);
                case MiscEnum.DELETE_SUBSCRIPTION_ACTION_ID:
                    await deleteSubscription({ app: this.app, context, data, room, modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http });
                    break;
                case ModalsEnum.SUBSCRIPTION_REFRESH_ACTION:
                    const subscriptionsmodal = await manageSubscriptionsModal({ app: this.app, modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http, uikitcontext: context });
                    await this.modify.getUiController().updateSurfaceView(subscriptionsmodal, { triggerId: context.getInteractionData().triggerId }, context.getInteractionData().user);
                    break;
                default:
                    break;
            }
        } catch (error) {
            return context.getInteractionResponder().viewErrorResponse({
                viewId: actionId,
                errors: error,
            });
        }

        return context.getInteractionResponder().successResponse();
    }
}
