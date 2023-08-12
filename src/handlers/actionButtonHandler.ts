import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUIKitResponse, UIKitActionButtonInteractionContext, UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { MiscEnum } from '../enums/Misc';
import { MiroApp } from '../../MiroApp';
import { createBoardModal } from '../modals/boards/createBoardModal';
import { viewEmbeddedBoardsModal } from '../modals/boards/viewEmbeddedBoardsModal';

export class ExecuteActionButtonHandler {
    constructor(
        public readonly app: MiroApp,
        public readonly read: IRead,
        public readonly http: IHttp,
        public readonly modify: IModify,
        public readonly persistence: IPersistence,
    ) {}

    public async run(context: UIKitActionButtonInteractionContext): Promise<IUIKitResponse> {
        const { room, user, actionId, triggerId } = context.getInteractionData();
        try {
            switch (actionId) {
                case MiscEnum.CREATE_BOARD_ACTION_ID:
                    const create_board_modal = await createBoardModal({ app: this.app, modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http, actionbuttoncontext: context });
                    await this.modify.getUiController().openSurfaceView(create_board_modal, { triggerId }, user);
                    return context.getInteractionResponder().successResponse();
                case MiscEnum.VIEW_EMBEDDED_BOARDS_ACTION_ID:
                    const view_embedded_modal = await viewEmbeddedBoardsModal({ app: this.app, modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http, actionbuttoncontext: context });
                    await this.modify.getUiController().openSurfaceView(view_embedded_modal, { triggerId }, user);
                    return context.getInteractionResponder().successResponse();
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
