import { IHttp, IModify, IPersistence, IRead, IUIKitSurfaceViewParam } from '@rocket.chat/apps-engine/definition/accessors';
import { ModalsEnum } from '../enums/Modals';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { UIKitInteractionContext, UIKitSurfaceType } from '@rocket.chat/apps-engine/definition/uikit';
import { Block } from '@rocket.chat/ui-kit';
import { getActionsBlock, getButton, getInputBox, getOptions, getSectionBlock, getStaticSelectElement } from '../helpers/blockBuilder';

export async function getBoardsModal({ modify, read, persistence, http, slashcommandcontext, uikitcontext, data }: { modify: IModify; read: IRead; persistence: IPersistence; http: IHttp; slashcommandcontext?: SlashCommandContext; uikitcontext?: UIKitInteractionContext; data?: string }): Promise<IUIKitSurfaceViewParam> {
  const viewId = ModalsEnum.GET_BOARDS;
  const block: Block[] = [];
  let title;

  let optionalParametersSectionBlock = await getSectionBlock(ModalsEnum.OPTIONAL_PARAMETERS_LABEL);

  data ? (title = `from team #${data?.split(',')[0]}`) : (title = '');

  let teamIdInputBox = await getInputBox(ModalsEnum.QUERY_INPUT_LABEL, ModalsEnum.TEAM_ID_INPUT_LABEL_DEFAULT, ModalsEnum.TEAM_ID_BLOCK, ModalsEnum.TEAM_ID_INPUT, data?.split(',')[3] || '');

  let projectIdInputBox = await getInputBox(ModalsEnum.PROJECT_ID_INPUT_LABEL, ModalsEnum.PROJECT_ID_INPUT_LABEL_DEFAULT, ModalsEnum.PROJECT_ID_BLOCK, ModalsEnum.PROJECT_ID_INPUT, `1`);

  let ownerIdInputBox = await getInputBox(ModalsEnum.OWNER_ID_INPUT_LABEL, ModalsEnum.OWNER_ID_INPUT_LABEL_DEFAULT, ModalsEnum.OWNER_ID_BLOCK, ModalsEnum.OWNER_ID_INPUT, data?.split(',')[3] || '');

  let queryInputBox = await getInputBox(ModalsEnum.QUERY_INPUT_LABEL, ModalsEnum.QUERY_INPUT_LABEL_DEFAULT, ModalsEnum.QUERY_BLOCK, ModalsEnum.QUERY_INPUT, data?.split(',')[3] || '');


  block.push(optionalParametersSectionBlock, teamIdInputBox, projectIdInputBox, ownerIdInputBox, queryInputBox);

  let closeButton = await getButton('Close', '', '');
  let submitButton = await getButton(ModalsEnum.GET_BOARDS_SUBMIT_BUTTON_LABEL, '', '');

  return {
    id: viewId,
    type: UIKitSurfaceType.MODAL,
    title: {
      type: 'plain_text',
      text: ModalsEnum.GET_BOARDS_MODAL_NAME + title,
    },
    close: closeButton,
    submit: submitButton,
    blocks: block,
  };
}