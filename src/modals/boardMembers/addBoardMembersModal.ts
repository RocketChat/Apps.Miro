import { IRead, IUIKitSurfaceViewParam } from '@rocket.chat/apps-engine/definition/accessors';
import { UIKitBlockInteractionContext, UIKitSurfaceType } from '@rocket.chat/apps-engine/definition/uikit';
import { Block, Option } from '@rocket.chat/ui-kit';
import { ModalsEnum } from '../../enums/Modals';
import { getActionsBlock, getButton, getMultiStaticElement, getOptions, getSectionBlock, getStaticSelectElement, getToggleSwitchElement } from '../../helpers/blockBuilder';

export async function addBoardMembersModal({ context, read }: { context: UIKitBlockInteractionContext, read: IRead}): Promise<IUIKitSurfaceViewParam> {
  const viewId = ModalsEnum.ADD_BOARD_MEMBERS;
  const block: Array<Block> = [];
  let board_id = context?.getInteractionData().value;
  const room = context?.getInteractionData().room!;
  const members = await read.getRoomReader().getMembers(room.id!);
  const selectOptions : Array<Option>  = [];
  for (const member of members) {
    selectOptions.push(await getOptions(member.name, member.id));
  }
  const roleOptions : Array<Option>  = [];
  roleOptions.push(await getOptions('Commentor', 'commentor'));
  roleOptions.push(await getOptions('Viewer', 'viewer'));
  roleOptions.push(await getOptions('Editor', 'editor'));
  roleOptions.push(await getOptions('Co-Owner', 'coowner'));
  roleOptions.push(await getOptions('Owner', 'owner'));

  const roomRequiredOptions : Array<Option>  = [];
  roomRequiredOptions.push(await getOptions('No', 'no'))
  roomRequiredOptions.push(await getOptions('Yes', 'yes'))

  const roomRequiredInitialOptions : Array<Option>  = [];
  roomRequiredInitialOptions.push(await getOptions('No', 'no'))

  const roleInputElement = await getStaticSelectElement(ModalsEnum.ROLE_INPUT_LABEL, roleOptions, ModalsEnum.ROLE_BLOCK, ModalsEnum.ROLE_INPUT);

  const roleInputBox = await getActionsBlock(ModalsEnum.ROLE_BLOCK, [roleInputElement]);

  const roleTitleBlock = await getSectionBlock(ModalsEnum.ROLE_INPUT_LABEL);

  const membersInputElement = await getMultiStaticElement(ModalsEnum.MEMBERS_INPUT_LABEL, selectOptions, ModalsEnum.MEMBERS_BLOCK, ModalsEnum.MEMBERS_INPUT);

  const membersInputBox = await getActionsBlock(ModalsEnum.MEMBERS_BLOCK, [membersInputElement]);

  const membersTitleBlock = await getSectionBlock(ModalsEnum.MEMBERS_INPUT_LABEL);

  const roomRequiredBlock = await getToggleSwitchElement(roomRequiredOptions, roomRequiredInitialOptions, ModalsEnum.ROOM_REQUIRED_BLOCK, ModalsEnum.ROOM_REQUIRED_ACTION_ID)

  block.push(roleTitleBlock, roleInputBox, membersTitleBlock, membersInputBox, roomRequiredBlock);

  const closeButton = await getButton('Close', '', '');
  const submitButton = await getButton(ModalsEnum.ADD_MEMBERS_SUBMIT_BUTTON_LABEL, '', '');

  return {
    id: viewId,
    type: UIKitSurfaceType.MODAL,
    title: {
      type: 'plain_text',
      text: ModalsEnum.ADD_BOARD_MEMBERS_MODAL_NAME + board_id,
    },
    close: closeButton,
    submit: submitButton,
    blocks: block,
  };
}
