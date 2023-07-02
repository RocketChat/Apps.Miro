import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { ButtonStyle, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitViewSubmitIncomingInteraction } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Block } from '@rocket.chat/ui-kit';
import { ModalsEnum } from '../../enums/Modals';
import { Texts } from '../../enums/Texts';
import { IGenericAPIFunctionParams } from '../../interfaces/external';
import { getMiroBoardsUrl } from '../../lib/const';
import { getAccessTokenForUser } from '../../storage/users';

export async function getBoards({ context, data, room, read, persistence, modify, http }: IGenericAPIFunctionParams) {
  const state = data.view.state;
  const user: IUser = context.getInteractionData().user;
  const token = await getAccessTokenForUser(read, user);
  const team_id = state?.[ModalsEnum.TEAM_ID_BLOCK]?.[ModalsEnum.TEAM_ID_INPUT];
  const project_id = state?.[ModalsEnum.PROJECT_ID_BLOCK]?.[ModalsEnum.PROJECT_ID_INPUT];
  const owner_id = state?.[ModalsEnum.OWNER_ID_BLOCK]?.[ModalsEnum.OWNER_ID_INPUT];
  const query = state?.[ModalsEnum.QUERY_BLOCK]?.[ModalsEnum.QUERY_INPUT];

  const headers = {
    Authorization: `${token?.token}`,
  };
  const url = getMiroBoardsUrl(team_id, project_id, owner_id, query);
  const response = await http.get(url, { headers });

  if (response.statusCode == HttpStatusCode.OK) {
    const builder = await modify.getCreator().startMessage().setRoom(room);
    const block: Array<Block> = [];
    // @TODO: handle response
    await modify.getNotifier().notifyUser(user, builder.getMessage());
  } else {
    const textSender = await modify.getCreator().startMessage().setText(Texts.getBoardsFailure + response.data.err);
    if (room) {
      textSender.setRoom(room);
    }
    await modify.getCreator().finish(textSender);
  }
}
