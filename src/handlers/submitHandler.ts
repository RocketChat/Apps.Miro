import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { UIKitViewSubmitInteractionContext} from '@rocket.chat/apps-engine/definition/uikit';
import { MiroApp } from '../../MiroApp';
import { getBoards } from '../api/boards/getBoards';
import { createBoard } from '../api/boards/createBoard';
import { updateBoard } from '../api/boards/updateBoard';
import { ModalsEnum } from '../enums/Modals';
import { getUIData } from '../lib/persistence';
import { inviteBoardMembers } from '../api/boardMembers/shareBoard';
import { createSubscription } from '../api/subscriptions/createSubscription';

export class ExecuteViewSubmitHandler {
	constructor(
		public readonly app: MiroApp,
		public readonly read: IRead,
		public readonly http: IHttp,
		public readonly modify: IModify,
		public readonly persistence: IPersistence,
	) {}

	public async run(context: UIKitViewSubmitInteractionContext) {
		const { user, view } = context.getInteractionData();
		const uiData = await getUIData(this.read.getPersistenceReader(), user.id);
		const room = uiData.room;
		const roomId = uiData.room?.id;
		const data = context.getInteractionData();

		try {
			switch (view.id) {
				case ModalsEnum.GET_BOARDS:
					await getBoards({ context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
					return context.getInteractionResponder().successResponse();
				case ModalsEnum.CREATE_BOARD:
					await createBoard({ context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
					return context.getInteractionResponder().successResponse();
				case ModalsEnum.ADD_BOARD_MEMBERS:
					await inviteBoardMembers({ context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
					return context.getInteractionResponder().successResponse();
				case ModalsEnum.EDIT_BOARD:
					await updateBoard({ context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
					return context.getInteractionResponder().successResponse();
				case ModalsEnum.ADD_SUBSCRIPTION:
					await createSubscription({ app: this.app, context, data, room, read: this.read, persistence: this.persistence, modify: this.modify, http: this.http });
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
