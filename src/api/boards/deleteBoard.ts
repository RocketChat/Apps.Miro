import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { getAccessTokenForUser } from "../../storage/users";
import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IBlockGenericAPIFunctionParams } from '../../interfaces/external';
import { getSpecificBoardsUrl } from "../../lib/const";
import { Texts } from '../../enums/Texts';

export async function deleteBoard({ app, context, data, room, read, persistence, modify, http }: IBlockGenericAPIFunctionParams) {
    const user: IUser = context.getInteractionData().user;
    const token = await app.getOauth2ClientInstance().getAccessTokenForUser(user);
    const board_id = context.getInteractionData().value;
    const headers = {
        Authorization: `Bearer ${token?.token}`,
    };
    const url = getSpecificBoardsUrl(board_id!);
    const response = await http.del(url, { headers });
    
    if (response.statusCode==HttpStatusCode.NO_CONTENT) {
        const textSender = await modify
        .getCreator()
        .startMessage()
        .setText(Texts.deleteBoardSuccess);
        if (room) {
            textSender.setRoom(room);
        }
        await modify.getCreator().finish(textSender);
    } else {
        const textSender = await modify.getCreator().startMessage().setText(Texts.deleteBoardFailure + response.data.message);
        if (room) {
            textSender.setRoom(room);
        }
        await modify.getCreator().finish(textSender);
    }
}
