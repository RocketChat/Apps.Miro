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
                    const members_modal = await addBoardMembersModal({ context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
                    await this.modify.getUiController().openSurfaceView(members_modal, {triggerId}, user);
                    return context.getInteractionResponder().successResponse();
                case MiscEnum.SHARE_BOARD_ACTION_ID:
                    await shareBoard({ context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
                    return context.getInteractionResponder().successResponse();
                case MiscEnum.EDIT_BOARD_ACTION_ID:
                    let board_data = await getBoardDataById({context, read: this.read, http: this.http})
                    const edit_board_modal = await editBoardModal({ context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http, extra: board_data });
                    await this.modify.getUiController().openSurfaceView(edit_board_modal, {triggerId}, user);
                    return context.getInteractionResponder().successResponse();
                case MiscEnum.DELETE_BOARD_ACTION_ID:
                    await deleteBoard({ context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
                    return context.getInteractionResponder().successResponse();
                case MiscEnum.SUBSCRIBE_BOARD_ACTION_ID:
                    const Subscriptionmodal = await addSubscriptionModal({ modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http, uikitcontext: context, data });
                    return context.getInteractionResponder().openModalViewResponse(Subscriptionmodal);
                case ModalsEnum.OPEN_ADD_SUBSCRIPTIONS_MODAL:
                    const addSubscriptionmodal = await addSubscriptionModal({ modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http, uikitcontext: context, data });
                    return context.getInteractionResponder().openModalViewResponse(addSubscriptionmodal);
                  case ModalsEnum.OPEN_DELETE_SUBSCRIPTIONS_MODAL:
                    const deleteSubscriptionmodal = await deleteSubscriptionModal({ modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http, uikitcontext: context, data });
                    return context.getInteractionResponder().openModalViewResponse(deleteSubscriptionmodal);
                  case ModalsEnum.DELETE_SUBSCRIPTION_ACTION:
                    await deleteSubscription({ context, data, room, modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http });
                    break;
                  case ModalsEnum.SUBSCRIPTION_REFRESH_ACTION:
                    const subscriptionsmodal = await manageSubscriptionsModal({ modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http, uikitcontext: context });
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
