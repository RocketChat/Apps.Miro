import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IOEmbedResponse } from '../../interfaces/external';
import { getoEmbedDataUrl } from "../../lib/const";
import { LayoutBlockType } from "@rocket.chat/ui-kit/dist/esm/blocks/LayoutBlockType";
import { DividerBlock, PreviewBlockWithPreview } from "@rocket.chat/ui-kit";
import { getDividerBlock, getPreviewBlock } from "../../helpers/blockBuilder";
import { EmbeddedBoards } from "../../storage/embeddedBoards";
import { Texts } from "../../enums/Texts";

export async function getoEmbedDataByBoardUrl({ app, context, http, data }: any) {
    const user: IUser = context.getInteractionData().user;
    const token = await app.getOauth2ClientInstance().getAccessTokenForUser(user);
    const board_url = data;
    const headers = {
        Authorization: `Bearer ${token?.token}`,
    };
    const url = getoEmbedDataUrl(board_url!);
    const response = await http.get(url, { headers });
    if (response.statusCode==HttpStatusCode.OK) {
      const oEmbedResponse: IOEmbedResponse = response.data;
      const block: PreviewBlockWithPreview = await getPreviewBlock(oEmbedResponse);
      console.log(block)
      return block;
    } else {
      const block: DividerBlock = await getDividerBlock();
        return block;
    }
}

export async function embedBoardToRoom({ modify, persistence, read, data, room }: any) {
  let embeddedBoardsStorage = new EmbeddedBoards(persistence, read.getPersistenceReader());
  let boardId = data.value.split('|')[0]
  let boardName = data.value.split('|')[1]
  let boardUrl = data.value.split('|')[2]
  await embeddedBoardsStorage.createEmbeddedBoard(boardName, boardId, boardUrl, room.id);
  const textSender = await modify.getCreator().startMessage().setText(Texts.embedBoardSuccess);
  if (room) {
      textSender.setRoom(room);
  }
  await modify.getCreator().finish(textSender);
}

export async function removeEmbeddedBoardFromRoom({ modify, persistence, read, data, room }: any) {
  let embeddedBoardsStorage = new EmbeddedBoards(persistence, read.getPersistenceReader());
  let roomId = data.value.split('|')[0]
  let boardUrl = data.value.split('|')[1]
  await embeddedBoardsStorage.deleteEmbeddedBoard(roomId, boardUrl);
  const textSender = await modify.getCreator().startMessage().setText(Texts.removeEmbeddedBoardSuccess);
  if (room) {
      textSender.setRoom(room);
  }
  await modify.getCreator().finish(textSender);
}