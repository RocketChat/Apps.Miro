import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IOEmbedResponse } from '../../interfaces/external';
import { getoEmbedDataUrl } from "../../lib/const";
import { LayoutBlockType } from "@rocket.chat/ui-kit/dist/esm/blocks/LayoutBlockType";
import { DividerBlock, PreviewBlockWithPreview } from "@rocket.chat/ui-kit";
import { getDividerBlock, getPreviewBlock } from "../../helpers/blockBuilder";

export async function getoEmbedDataByBoardUrl({app, context, http }: any) {
    const user: IUser = context.getInteractionData().user;
    const token = await app.getOauth2ClientInstance().getAccessTokenForUser(user);
    const board_url = context.getInteractionData().value;
    const headers = {
        Authorization: `Bearer ${token?.token}`,
    };
    const url = getoEmbedDataUrl(board_url!);
    const response = await http.get(url, { headers });
    
    if (response.statusCode==HttpStatusCode.OK) {
      const oEmbedResponse: IOEmbedResponse = JSON.parse(response.data);
      const block: PreviewBlockWithPreview = await getPreviewBlock(oEmbedResponse);
      return block;
    } else {
      const block: DividerBlock = await getDividerBlock();
        return block;
    }
}