import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { getAccessTokenForUser } from "../../storage/users";
import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IBlockGenericAPIFunctionParams } from '../../interfaces/external';
import { getSpecificBoardsUrl } from "../../lib/const";
import { Texts } from '../../enums/Texts';

export async function shareBoard({context, data, room, read, persistence, modify, http }: IBlockGenericAPIFunctionParams) {
    const user: IUser = context.getInteractionData().user;
    const token = await getAccessTokenForUser(read, user);
    const board_id = context.getInteractionData().value;
    const headers = {
        Authorization: `Bearer ${token?.token}`,
    };
    const url = getSpecificBoardsUrl(board_id!);
    const response = await http.get(url, { headers });
    
    if (response.statusCode==HttpStatusCode.OK) {
        const textSender = await modify
        .getCreator()
        .startMessage()
        .setText(`[${response.data.name}](${response.data.viewLink})`+` | ${response.data.description}`.slice(0, 80) + `...`);
        if (room) {
            textSender.setRoom(room);
        }
        await modify.getCreator().finish(textSender);
    } else {
        const textSender = await modify.getCreator().startMessage().setText(Texts.getSpecificBoardFailure + response.data.message);
        if (room) {
            textSender.setRoom(room);
        }
        await modify.getCreator().finish(textSender);
    }
}

export async function getBoardDataById({context, read, http }: any) {
    const user: IUser = context.getInteractionData().user;
    const token = await getAccessTokenForUser(read, user);
    const board_id = context.getInteractionData().value;
    const headers = {
        Authorization: `Bearer ${token?.token}`,
    };
    const url = getSpecificBoardsUrl(board_id!);
    const response = await http.get(url, { headers });
    
    if (response.statusCode==HttpStatusCode.OK) {
        
        let id = response.data.id;
        let name = response.data.name;
        let desc = response.data.description;
        let teamId = response.data.team.id;
        let projectId = response.data.project.id;
        let data = { id, name, desc, teamId, projectId };

        return data

    } else {
        return {}
    }
}