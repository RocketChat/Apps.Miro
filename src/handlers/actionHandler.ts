import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { IUIKitResponse, UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { UIKitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { MiscEnum } from '../enums/Misc';
import { deleteBoard } from '../api/boards/deleteBoard';
// import { editBoard } from '../lib/get/editBoard';
import { shareBoard } from '../api/boards/getSpecificBoard';
import { getUIData } from '../lib/persistence';
import { MiroApp } from '../../MiroApp';
import { addBoardMembersModal } from '../modals/boardMembers/addBoardMembersModal';
// import { AddSubscriptionModal } from '../modals/boards/addSubscriptionModal';

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
                    const modal = await addBoardMembersModal({ context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
                    await this.modify.getUiController().openSurfaceView(modal,{triggerId},user);
                    return context.getInteractionResponder().successResponse();
                case MiscEnum.SHARE_BOARD_ACTION_ID:
                    await shareBoard({ context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
                    return context.getInteractionResponder().successResponse();
                // case MiscEnum.EDIT_BOARD_ACTION_ID:
                //     await editBoard({ context, data, room, read, persistence, modify, http });
                //     return context.getInteractionResponder().successResponse();
                case MiscEnum.DELETE_BOARD_ACTION_ID:
                    await deleteBoard({ context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
                    return context.getInteractionResponder().successResponse();
                // case MiscEnum.SUBSCRIBE_BOARD_ACTION_ID:
                //     const Subscriptionmodal = await AddSubscriptionModal({ modify, read, persistence, http, uikitcontext: context, data: context.getInteractionData().value });
                //     return context.getInteractionResponder().openModalViewResponse(Subscriptionmodal);
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
