import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { UIKitInteractionContext , UIKitViewSubmitInteractionContext} from '@rocket.chat/apps-engine/definition/uikit';
import { MiroApp } from '../../MiroApp';
import { getBoards } from '../api/boards/getBoards';
import { ModalsEnum } from '../enums/Modals';
import { getUIData } from '../lib/persistence';

export class ExecuteViewSubmitHandler {
	constructor(
		private readonly app: MiroApp,
		private readonly read: IRead,
		private readonly http: IHttp,
		private readonly modify: IModify,
		private readonly persistence: IPersistence,

	) {}

	public async run(
        app: MiroApp,
        context: UIKitViewSubmitInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
        slashcommandcontext?: SlashCommandContext,
        uikitcontext?: UIKitInteractionContext) {
		const { user, view } = context.getInteractionData();
  const uiData = await getUIData(read.getPersistenceReader(), user.id);
  const room = uiData.room;
  const roomId  =  uiData.room?.id;
  const data = context.getInteractionData();
  try {
    switch (view.id) {
        case ModalsEnum.GET_BOARDS:
            await getBoards({context, data, room, read, persistence, modify, http});
            return context.getInteractionResponder().successResponse();
        default:
            break;
        }
    } catch (error) {
        return context.getInteractionResponder().viewErrorResponse({
            viewId: data.view.id,
            errors: error,
        });
    }
		return {
			success: true,
		};
	}
}
