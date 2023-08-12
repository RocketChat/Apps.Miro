import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { MiroApp } from '../../../MiroApp';
import { persistUIData } from '../../lib/persistence';
import { getBoardsModal } from '../../modals/boards/getBoardsModal';

export async function getBoards(app: MiroApp, read: IRead, modify: IModify, context: SlashCommandContext, persistence: IPersistence, http: IHttp): Promise<void> {
  const triggerId = context.getTriggerId();
  if (triggerId) {
    await persistUIData(persistence, context.getSender().id, context);
    const modal = await getBoardsModal({ app, modify, read, persistence, http, slashcommandcontext: context });
    await modify.getUiController().openSurfaceView(modal, { triggerId }, context.getSender());
  } else {
    this.app.getLogger().error('Invalid Trigger ID');
  }
}
