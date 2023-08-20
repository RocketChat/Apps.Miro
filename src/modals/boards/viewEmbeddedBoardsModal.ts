import { IHttp, IModify, IPersistence, IRead, IUIKitSurfaceViewParam } from '@rocket.chat/apps-engine/definition/accessors';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { UIKitInteractionContext, UIKitSurfaceType } from '@rocket.chat/apps-engine/definition/uikit';
import { Block, Option } from '@rocket.chat/ui-kit';
import { ModalsEnum } from '../../enums/Modals';
import { getActionsBlock, getButton, getInputBox, getMultiStaticElement, getOptions, getSectionBlock, getStaticSelectElement } from '../../helpers/blockBuilder';
import { IGenericModal } from '../../interfaces/external';
import { EmbeddedBoards } from "../../storage/embeddedBoards";
import { IEmbeddedBoard } from "../../interfaces/external";
import { MiscEnum } from '../../enums/Misc';
import { getoEmbedDataByBoardUrl } from '../../api/boards/getoEmbedData';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';

export async function viewEmbeddedBoardsModal({ app, modify, read, persistence, http, actionbuttoncontext, data }: IGenericModal): Promise<IUIKitSurfaceViewParam> {
  const viewId = ModalsEnum.VIEW_EMBEDDED_BOARDS;
  const block: Array<Block> = [];
  const room = actionbuttoncontext?.getInteractionData().room!
  let embeddedBoardsStorage = new EmbeddedBoards(app, persistence, read.getPersistenceReader());
  let roomEmbeddedBoards: Array<IEmbeddedBoard> = await embeddedBoardsStorage.getEmbeddedBoards(room.id);
  let index = 1;
    for (let board of roomEmbeddedBoards) {
      let boardName = board.boardName;
      let boardId = board.boardId;
      let boardUrl = board.boardUrl;
      let boardPreview = await getoEmbedDataByBoardUrl({app: app, context: actionbuttoncontext, http: http, data: boardUrl});
      let removeBoardEmbedButton = await getButton(MiscEnum.REMOVE_BOARD_EMBEDDING_BUTTON, "", MiscEnum.REMOVE_BOARD_EMBEDDING_ACTION_ID, `${room.id}|${boardUrl}`, ButtonStyle.DANGER);
      let boardSectionBlock = await getSectionBlock(`${index}) ${boardName}`, removeBoardEmbedButton);  
      block.push(boardSectionBlock, boardPreview);
      index++;
    }
  const closeButton = await getButton('Close', '', '');

  return {
    id: viewId,
    type: UIKitSurfaceType.CONTEXTUAL_BAR,
    title: {
      type: 'plain_text',
      text: ModalsEnum.VIEW_EMBEDDED_BOARD_MODAL_NAME,
    },
    close: closeButton,
    blocks: block,
  };
}
