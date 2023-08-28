import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Block } from '@rocket.chat/ui-kit';
import { MiscEnum } from '../../enums/Misc';
import { ModalsEnum } from '../../enums/Modals';
import { Texts } from '../../enums/Texts';
import { getActionsBlock, getButton, getContextBlock, getSectionBlock } from '../../helpers/blockBuilder';
import { ISubmitGenericAPIFunctionParams } from '../../interfaces/external';
import { getBoardsUrl } from '../../lib/const';

export async function getBoards({ app, context, data, room, read, persistence, modify, http }: ISubmitGenericAPIFunctionParams) {
  const state = data.view.state;
  const user: IUser = context.getInteractionData().user;
  const token = await app.getOauth2ClientInstance().getAccessTokenForUser(user);
  const team_id = state?.[ModalsEnum.TEAM_ID_BLOCK]?.[ModalsEnum.TEAM_ID_INPUT];
  const project_id = state?.[ModalsEnum.PROJECT_ID_BLOCK]?.[ModalsEnum.PROJECT_ID_INPUT];
  const owner_id = state?.[ModalsEnum.OWNER_ID_BLOCK]?.[ModalsEnum.OWNER_ID_INPUT];
  const query = state?.[ModalsEnum.QUERY_BLOCK]?.[ModalsEnum.QUERY_INPUT];
  const headers = {
    Authorization: `Bearer ${token?.token}`,
  };
  const url = getBoardsUrl(team_id, project_id, owner_id, query);
  const response = await http.get(url, { headers });
  if (response.statusCode == HttpStatusCode.OK) {
    const builder = await modify.getCreator().startMessage().setRoom(room);
    const block: Array<Block> = [];
    for (const board of response.data.data) {
      const boardNameSectionBlock = await getSectionBlock(`${board.name}`);
      const boardDescriptionContextBlock = await getContextBlock(`Description: ` + `${board.description}`.slice(0, 80) + `...`);
      block.push(boardNameSectionBlock, boardDescriptionContextBlock);
      const viewBoardButton = await getButton(MiscEnum.VIEW_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.VIEW_BOARD_ACTION_ID, `${board.viewLink}`, undefined, `${board.viewLink}`);
      const shareBoardButton = await getButton(MiscEnum.SHARE_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.SHARE_BOARD_ACTION_ID, `${board.id}`, ButtonStyle.PRIMARY);
      const editBoardButton = await getButton(MiscEnum.EDIT_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.EDIT_BOARD_ACTION_ID, `${board.id}`);
      const deleteBoardButton = await getButton(MiscEnum.DELETE_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.DELETE_BOARD_ACTION_ID, `${board.id}`, ButtonStyle.DANGER);
      const subscribeBoardButton = await getButton(MiscEnum.SUBSCRIBE_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.SUBSCRIBE_BOARD_ACTION_ID, `${board.id}|${board.name}`, ButtonStyle.PRIMARY);
      const embedBoardButton = await getButton(MiscEnum.EMBED_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.EMBED_BOARD_ACTION_ID,`${board.id}|${board.name}|${board.viewLink}`, ButtonStyle.PRIMARY);
      const boardActionBlock = await getActionsBlock(MiscEnum.BOARD_ACTIONS_BLOCK, [viewBoardButton, shareBoardButton, editBoardButton, deleteBoardButton, subscribeBoardButton, embedBoardButton]);
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
