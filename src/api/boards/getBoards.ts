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
import { getActionsBlock, getButton, getContextBlock, getSectionBlock } from "../../helpers/blockBuilder";
import { MiscEnum } from "../../enums/Misc";


export async function getBoards({ context, data, room, read, persistence, modify, http }: IGenericAPIFunctionParams) {
  const state = data.view.state;
  const user: IUser = context.getInteractionData().user;
  const token = await getAccessTokenForUser(read, user);
  const team_id = state?.[ModalsEnum.TEAM_ID_BLOCK]?.[ModalsEnum.TEAM_ID_INPUT];
  const project_id = state?.[ModalsEnum.PROJECT_ID_BLOCK]?.[ModalsEnum.PROJECT_ID_INPUT];
  const owner_id = state?.[ModalsEnum.OWNER_ID_BLOCK]?.[ModalsEnum.OWNER_ID_INPUT];
  const query = state?.[ModalsEnum.QUERY_BLOCK]?.[ModalsEnum.QUERY_INPUT];
  const headers = {
    Authorization: `Bearer ${token?.token}`,
  };
  const url = getMiroBoardsUrl(team_id, project_id, owner_id, query);
  const response = await http.get(url, { headers });
  if (response.statusCode == HttpStatusCode.OK) {
    const builder = await modify.getCreator().startMessage().setRoom(room);
    const block: Array<Block> = [];
    for (const board of response.data.data) {
      let boardNameSectionBlock = await getSectionBlock(`${board.name}`);
      let boardDescriptionContextBlock = await getContextBlock(`Description: ` + `${board.description}`.slice(0, 80) + `...`);
      block.push(boardNameSectionBlock, boardDescriptionContextBlock);
      let viewBoardButton = await getButton(MiscEnum.VIEW_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.VIEW_BOARD_ACTION_ID, `${board.url}`, undefined, `${board.url}`);
      let shareBoardButton = await getButton(MiscEnum.SHARE_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.SHARE_BOARD_ACTION_ID, `${board.id}`, ButtonStyle.PRIMARY);
      let editBoardButton = await getButton(MiscEnum.EDIT_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.EDIT_BOARD_ACTION_ID, `${board.id}`);
      let deleteBoardButton = await getButton(MiscEnum.DELETE_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.DELETE_BOARD_ACTION_ID, `${board.id}`, ButtonStyle.DANGER);
      let subscribeboardButton = await getButton(MiscEnum.SUBSCRIBE_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.SUBSCRIBE_BOARD_ACTION_ID, `${board.name},${board.id}`, ButtonStyle.PRIMARY);
      let boardActionBlock = await getActionsBlock(MiscEnum.BOARD_ACTIONS_BLOCK, [viewBoardButton, shareBoardButton, editBoardButton, deleteBoardButton, subscribeboardButton]);
      block.push(boardActionBlock);
      builder.setBlocks(block);
    }
    await modify.getNotifier().notifyUser(user, builder.getMessage());
  } else {
    const textSender = await modify.getCreator().startMessage().setText(Texts.getBoardsFailure + response.data.message);
    if (room) {
      textSender.setRoom(room);
    }
    await modify.getCreator().finish(textSender);
  }
}
