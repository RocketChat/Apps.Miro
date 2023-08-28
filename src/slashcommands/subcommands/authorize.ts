import { IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Block } from '@rocket.chat/ui-kit';
import { MiroApp } from '../../../MiroApp';
import { getButton, getSectionBlock } from '../../helpers/blockBuilder';
import { sendDirectMessage } from '../../lib/message';

export async function authorize(app: MiroApp, read: IRead, modify: IModify, user: IUser, persistence: IPersistence,): Promise<void> {
    const url = await app.getOauth2ClientInstance().getUserAuthorizationUrl(user);
    const block: Array<Block> = [];
    const authButton = await getButton('Authorize', '', '', '', ButtonStyle.PRIMARY, url.toString());
    const textsectionBlock = await getSectionBlock('Please click the button below to authorize access to your Miro account 👇', authButton);
    block.push(textsectionBlock);
    await sendDirectMessage(read, modify, user, '', persistence, block);
}
