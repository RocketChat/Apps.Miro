import { IHttp, IModify, IPersistence, IRead, IUIKitSurfaceViewParam } from '@rocket.chat/apps-engine/definition/accessors';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { UIKitInteractionContext, UIKitSurfaceType } from '@rocket.chat/apps-engine/definition/uikit';
import { Block, Option } from '@rocket.chat/ui-kit';
import { ModalsEnum } from '../../enums/Modals';
import { getActionsBlock, getButton, getInputBox, getMultiStaticElement, getOptions, getSectionBlock, getStaticSelectElement } from '../../helpers/blockBuilder';
import { IGenericModal } from '../../interfaces/external';

export async function editBoardModal({ modify, read, persistence, http, slashcommandcontext, uikitcontext, actionbuttoncontext, data }: IGenericModal): Promise<IUIKitSurfaceViewParam> {
  const viewId = ModalsEnum.EDIT_BOARD;
  const block: Array<Block> = [];
  let { id, name, desc, teamId, projectId, members } = data;
  const room = slashcommandcontext?.getRoom() || uikitcontext?.getInteractionData().room! || actionbuttoncontext?.getInteractionData().room!
  const selectOptions : Option[]  = [];
  const optionalParametersSectionBlock = await getSectionBlock(ModalsEnum.OPTIONAL_PARAMETERS_LABEL);
  for (const member of members) {
    selectOptions.push(await getOptions(member.name, member.id));
}

  const boardNameInputBox = await getInputBox(ModalsEnum.BOARD_NAME_INPUT_LABEL, ModalsEnum.BOARD_NAME_INPUT_LABEL_DEFAULT, ModalsEnum.BOARD_NAME_BLOCK, ModalsEnum.BOARD_NAME_INPUT, name);

  const boardDescriptionInputBox = await getInputBox(ModalsEnum.BOARD_DESCRIPTION_INPUT_LABEL, ModalsEnum.BOARD_DESCRIPTION_INPUT_LABEL_DEFAULT, ModalsEnum.BOARD_DESCRIPTION_BLOCK, ModalsEnum.BOARD_DESCRIPTION_INPUT, desc);

  const teamIdInputBox = await getInputBox(ModalsEnum.TEAM_ID_INPUT_LABEL, ModalsEnum.TEAM_ID_INPUT_LABEL_DEFAULT, ModalsEnum.TEAM_ID_BLOCK, ModalsEnum.TEAM_ID_INPUT, teamId);

  const projectIdInputBox = await getInputBox(ModalsEnum.PROJECT_ID_INPUT_LABEL, ModalsEnum.PROJECT_ID_INPUT_LABEL_DEFAULT, ModalsEnum.PROJECT_ID_BLOCK, ModalsEnum.PROJECT_ID_INPUT, projectId);

  const membersInputElement = await getMultiStaticElement(ModalsEnum.MEMBERS_INPUT_LABEL, selectOptions, ModalsEnum.MEMBERS_BLOCK, ModalsEnum.MEMBERS_INPUT);

  const membersInputBox = await getActionsBlock(ModalsEnum.MEMBERS_BLOCK, [membersInputElement]);

  const membersTitleBlock = await getSectionBlock(ModalsEnum.MEMBERS_INPUT_LABEL);

  block.push(optionalParametersSectionBlock, boardNameInputBox, teamIdInputBox, boardDescriptionInputBox, projectIdInputBox, membersTitleBlock, membersInputBox);

  const closeButton = await getButton('Close', '', '');
  const submitButton = await getButton(ModalsEnum.UPDATE_BOARD_SUBMIT_BUTTON_LABEL, '', '');

  return {
    id: viewId,
    type: UIKitSurfaceType.MODAL,
    title: {
      type: 'plain_text',
      text: ModalsEnum.EDIT_BOARD_MODAL_NAME + id,
    },
    close: closeButton,
    submit: submitButton,
    blocks: block,
  };
}
