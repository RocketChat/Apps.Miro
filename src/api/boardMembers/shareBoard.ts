import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { ButtonStyle, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitViewSubmitIncomingInteraction } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Block } from '@rocket.chat/ui-kit';
import { MiscEnum } from '../../enums/Misc';
import { ModalsEnum } from '../../enums/Modals';
import { Texts } from '../../enums/Texts';
import { getActionsBlock, getButton, getContextBlock, getSectionBlock } from '../../helpers/blockBuilder';
import { ISubmitGenericAPIFunctionParams } from '../../interfaces/external';
import { getBoardMembersUrl } from '../../lib/const';
import { getAccessTokenForUser } from '../../storage/users';

export async function inviteBoardMembers({ app, context, data, room, read, persistence, modify, http }: ISubmitGenericAPIFunctionParams) {
  const state = data.view.state;
  const user: IUser = context.getInteractionData().user;
  const token = await app.getOauth2ClientInstance().getAccessTokenForUser(user);
  const board_id = data.view.title.text.split("#")[1]
  const role = state?.[ModalsEnum.ROLE_BLOCK]?.[ModalsEnum.ROLE_INPUT];
  const members = state?.[ModalsEnum.MEMBERS_BLOCK]?.[ModalsEnum.MEMBERS_INPUT];
  let board_members_emails: Array<string> = []
  for (const member of members) {
    let rcUser = read.getUserReader().getById(member);
    board_members_emails.push((await rcUser).emails['address'])
  }
  const headers = {
    Authorization: `Bearer ${token?.token}`,
  };
  const body = {
    ...(board_members_emails && { emails: board_members_emails }),
    ...(role && { role: role })
  };
  const url = getBoardMembersUrl(board_id);
  const response = await http.post(url, { headers, data: body });
  if (response.statusCode == HttpStatusCode.CREATED) {
    const textSender = await modify.getCreator().startMessage().setText(Texts.addBoardMembersSuccess + response.data.message);
    if (room) {
      textSender.setRoom(room);
    }
    await modify.getCreator().finish(textSender);
  } else {
    const textSender = await modify.getCreator().startMessage().setText(Texts.addBoardMembersFailure + response.data.message);
    if (room) {
      textSender.setRoom(room);
    }
    await modify.getCreator().finish(textSender);
  }
}
