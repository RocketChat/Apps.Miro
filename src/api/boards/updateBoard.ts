import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Block } from '@rocket.chat/ui-kit';
import { MiscEnum } from '../../enums/Misc';
import { ModalsEnum } from '../../enums/Modals';
import { Texts } from '../../enums/Texts';
import { getActionsBlock, getButton, getContextBlock, getSectionBlock } from '../../helpers/blockBuilder';
import { ISubmitGenericAPIFunctionParams } from '../../interfaces/external';
import { getSpecificBoardsUrl } from '../../lib/const';
import { getAccessTokenForUser } from '../../storage/users';

export async function updateBoard({ app, context, data, room, read, persistence, modify, http }: ISubmitGenericAPIFunctionParams) {
  const state = data.view.state;
  const user: IUser = context.getInteractionData().user;
  const token = await app.getOauth2ClientInstance().getAccessTokenForUser(user);
  const board_id = data.view.title.text.split("#")[1];
  const team_id = state?.[ModalsEnum.TEAM_ID_BLOCK]?.[ModalsEnum.TEAM_ID_INPUT];
  const project_id = state?.[ModalsEnum.PROJECT_ID_BLOCK]?.[ModalsEnum.PROJECT_ID_INPUT];
  const board_name = state?.[ModalsEnum.BOARD_NAME_BLOCK]?.[ModalsEnum.BOARD_NAME_INPUT];
  const board_description = state?.[ModalsEnum.BOARD_DESCRIPTION_BLOCK]?.[ModalsEnum.BOARD_DESCRIPTION_INPUT];
  const headers = {
    Authorization: `Bearer ${token?.token}`,
  };
  const body = {
    ...(board_description && { description: board_description }),
    ...(board_name && { name: board_name }),
    ...(team_id && { teamId: team_id }),
    ...(project_id && { projectId: project_id })
  };
  const url = getSpecificBoardsUrl(board_id);
  const response = await http.post(url, { headers, data: body });
  if (response.statusCode == HttpStatusCode.OK) {
    const builder = await modify.getCreator().startMessage().setRoom(room);
    const block: Array<Block> = [];
    let board = response.data;
    const boardNameSectionBlock = await getSectionBlock(`Board ${board.name} updated successfully!`);
    const boardDescriptionContextBlock = await getContextBlock(`Description: ` + `${board.description}`.slice(0, 80) + `...`);
    block.push(boardNameSectionBlock, boardDescriptionContextBlock);
    const viewBoardButton = await getButton(MiscEnum.VIEW_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.VIEW_BOARD_ACTION_ID, `${board.viewLink}`, undefined, `${board.viewLink}`);
    const addBoardMembersButton = await getButton(MiscEnum.ADD_BOARD_MEMBERS_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.ADD_BOARD_MEMBERS_ACTION_ID, `${board.id}`, ButtonStyle.PRIMARY);
    const shareBoardButton = await getButton(MiscEnum.SHARE_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.SHARE_BOARD_ACTION_ID, `${board.id}`, ButtonStyle.PRIMARY);
    const editBoardButton = await getButton(MiscEnum.EDIT_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.EDIT_BOARD_ACTION_ID, `${board.id}`);
    const deleteBoardButton = await getButton(MiscEnum.DELETE_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.DELETE_BOARD_ACTION_ID, `${board.id}`, ButtonStyle.DANGER);
    const subscribeboardButton = await getButton(MiscEnum.SUBSCRIBE_BOARD_BUTTON, MiscEnum.BOARD_ACTIONS_BLOCK, MiscEnum.SUBSCRIBE_BOARD_ACTION_ID, `${board.name},${board.id}`, ButtonStyle.PRIMARY);
    const boardActionBlock = await getActionsBlock(MiscEnum.BOARD_ACTIONS_BLOCK, [addBoardMembersButton, viewBoardButton, shareBoardButton, editBoardButton, deleteBoardButton, subscribeboardButton]);
    block.push(boardActionBlock);
    builder.setBlocks(block);
    await modify.getNotifier().notifyUser(user, builder.getMessage());
  } else {
    const textSender = await modify.getCreator().startMessage().setText(Texts.updateBoardFailure + response.data.message);
    if (room) {
      textSender.setRoom(room);
    }
    await modify.getCreator().finish(textSender);
  }
}
