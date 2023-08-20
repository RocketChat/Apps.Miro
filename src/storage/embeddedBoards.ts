import { IPersistence, IPersistenceRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IEmbeddedBoard } from '../interfaces/external';
import { MiroApp } from '../../MiroApp';

export class EmbeddedBoards {
  constructor(public readonly app: MiroApp, private readonly persistence: IPersistence, private readonly persistenceRead: IPersistenceRead) {}

  public async createEmbeddedBoard(boardName: string, boardId: string, boardUrl: string, roomId: string): Promise<boolean> {
    try {
      const associations: Array<RocketChatAssociationRecord> = [new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `boardembed`), new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `boardUrl:${boardUrl}`), new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `boardId:${boardId}`), new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, roomId)];
      let subscriptionRecord: IEmbeddedBoard = {
        boardUrl,
        roomId,
        boardName,
        boardId
      };
      await this.persistence.updateByAssociations(associations, subscriptionRecord, true);
    } catch (error) {
      this.app.getLogger().error('Error :', error);
      return false;
    }
    return true;
  }


  public async getEmbeddedBoards(roomId: string): Promise<Array<IEmbeddedBoard>> {
    try {
      const associations: Array<RocketChatAssociationRecord> = [new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `boardembed`), new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, roomId)];
      let embeddedBoards: Array<IEmbeddedBoard> = (await this.persistenceRead.readByAssociations(associations)) as Array<IEmbeddedBoard>;
      return embeddedBoards;
    } catch (error) {
      this.app.getLogger().error('Error :', error);
      let embeddedBoards: Array<IEmbeddedBoard> = [];
      return embeddedBoards;
    }
  }

  public async deleteEmbeddedBoard(roomId: string, boardUrl: string): Promise<boolean> {
    try {
      const associations: Array<RocketChatAssociationRecord> = [new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `boardembed`), new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `boardUrl:${boardUrl}`), new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, roomId)];
      await this.persistence.removeByAssociations(associations);
    } catch (error) {
      this.app.getLogger().error('Error :', error);
      return false;
    }
    return true;
  }
}