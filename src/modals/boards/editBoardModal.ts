import { IUIKitSurfaceViewParam } from '@rocket.chat/apps-engine/definition/accessors';
import { UIKitSurfaceType } from '@rocket.chat/apps-engine/definition/uikit';
import { Block } from '@rocket.chat/ui-kit';
import { ModalsEnum } from '../../enums/Modals';
import { getButton, getInputBox, getSectionBlock } from '../../helpers/blockBuilder';
import { IBlockGenericAPIFunctionParams } from '../../interfaces/external';

export async function editBoardModal({ context, data, modify, read, persistence, http, extra }: IBlockGenericAPIFunctionParams): Promise<IUIKitSurfaceViewParam> {
  const viewId = ModalsEnum.EDIT_BOARD;
  const block: Array<Block> = [];
  let { id, name, desc, teamId, projectId } = extra;
  
  const optionalParametersSectionBlock = await getSectionBlock(ModalsEnum.OPTIONAL_PARAMETERS_LABEL);

  const boardNameInputBox = await getInputBox(ModalsEnum.BOARD_NAME_INPUT_LABEL, ModalsEnum.BOARD_NAME_INPUT_LABEL_DEFAULT, ModalsEnum.BOARD_NAME_BLOCK, ModalsEnum.BOARD_NAME_INPUT, name);

  const boardDescriptionInputBox = await getInputBox(ModalsEnum.BOARD_DESCRIPTION_INPUT_LABEL, ModalsEnum.BOARD_DESCRIPTION_INPUT_LABEL_DEFAULT, ModalsEnum.BOARD_DESCRIPTION_BLOCK, ModalsEnum.BOARD_DESCRIPTION_INPUT, desc);

  const teamIdInputBox = await getInputBox(ModalsEnum.TEAM_ID_INPUT_LABEL, ModalsEnum.TEAM_ID_INPUT_LABEL_DEFAULT, ModalsEnum.TEAM_ID_BLOCK, ModalsEnum.TEAM_ID_INPUT, teamId);

  const projectIdInputBox = await getInputBox(ModalsEnum.PROJECT_ID_INPUT_LABEL, ModalsEnum.PROJECT_ID_INPUT_LABEL_DEFAULT, ModalsEnum.PROJECT_ID_BLOCK, ModalsEnum.PROJECT_ID_INPUT, projectId);

  block.push(optionalParametersSectionBlock, boardNameInputBox, teamIdInputBox, boardDescriptionInputBox, projectIdInputBox);

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
