import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { IUIKitResponse, UIKitActionButtonInteractionContext, UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { UIKitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { MiscEnum } from '../enums/Misc';
import { shareBoard } from '../api/boards/getSpecificBoard';
import { getUIData } from '../lib/persistence';
import { MiroApp } from '../../MiroApp';
import { createBoardModal } from '../modals/boards/createBoardModal';

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
        console.log("getting into action button handler")
        try {
            switch (actionId) {
                case MiscEnum.CREATE_BOARD_ACTION_ID:
                    const modal = await createBoardModal({  modify: this.modify, read: this.read, persistence: this.persistence,  http: this.http, actionbuttoncontext: context });
                    await this.modify.getUiController().openSurfaceView(modal, { triggerId }, user);
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
