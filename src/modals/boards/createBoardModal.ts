import { IHttp, IModify, IPersistence, IRead, IUIKitSurfaceViewParam } from '@rocket.chat/apps-engine/definition/accessors';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { UIKitInteractionContext, UIKitSurfaceType } from '@rocket.chat/apps-engine/definition/uikit';
import { Block, Option } from '@rocket.chat/ui-kit';
import { ModalsEnum } from '../../enums/Modals';
import { getActionsBlock, getButton, getInputBox, getMultiStaticElement, getOptions, getSectionBlock, getStaticSelectElement } from '../../helpers/blockBuilder';
import { IGenericModal } from '../../interfaces/external';

export async function createBoardModal({ app, modify, read, persistence, http, slashcommandcontext, uikitcontext, actionbuttoncontext, data }: IGenericModal): Promise<IUIKitSurfaceViewParam> {
  const viewId = ModalsEnum.CREATE_BOARD;
  const block: Array<Block> = [];
  const room = slashcommandcontext?.getRoom() || uikitcontext?.getInteractionData().room! || actionbuttoncontext?.getInteractionData().room!

  const optionalParametersSectionBlock = await getSectionBlock(ModalsEnum.OPTIONAL_PARAMETERS_LABEL);
  
  const boardNameInputBox = await getInputBox(ModalsEnum.BOARD_NAME_INPUT_LABEL, ModalsEnum.BOARD_NAME_INPUT_LABEL_DEFAULT, ModalsEnum.BOARD_NAME_BLOCK, ModalsEnum.BOARD_NAME_INPUT, '');

  const boardDescriptionInputBox = await getInputBox(ModalsEnum.BOARD_DESCRIPTION_INPUT_LABEL, ModalsEnum.BOARD_DESCRIPTION_INPUT_LABEL_DEFAULT, ModalsEnum.BOARD_DESCRIPTION_BLOCK, ModalsEnum.BOARD_DESCRIPTION_INPUT, '');

  const teamIdInputBox = await getInputBox(ModalsEnum.TEAM_ID_INPUT_LABEL, ModalsEnum.TEAM_ID_INPUT_LABEL_DEFAULT, ModalsEnum.TEAM_ID_BLOCK, ModalsEnum.TEAM_ID_INPUT, '');

  const projectIdInputBox = await getInputBox(ModalsEnum.PROJECT_ID_INPUT_LABEL, ModalsEnum.PROJECT_ID_INPUT_LABEL_DEFAULT, ModalsEnum.PROJECT_ID_BLOCK, ModalsEnum.PROJECT_ID_INPUT, '');

  block.push(optionalParametersSectionBlock, boardNameInputBox, teamIdInputBox, boardDescriptionInputBox, projectIdInputBox);

  const closeButton = await getButton('Close', '', '');
  const submitButton = await getButton(ModalsEnum.CREATE_BOARD_SUBMIT_BUTTON_LABEL, '', '');

  return {
    id: viewId,
    type: UIKitSurfaceType.MODAL,
    title: {
      type: 'plain_text',
      text: ModalsEnum.CREATE_BOARD_MODAL_NAME,
    },
    close: closeButton,
    submit: submitButton,
    blocks: block,
  };
}
