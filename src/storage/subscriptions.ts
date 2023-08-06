import { IPersistence, IPersistenceRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { ISubscription } from '../interfaces/external';

export class Subscription {
  constructor(private readonly persistence: IPersistence, private readonly persistenceRead: IPersistenceRead) {}

  public async createSubscription(boardName: string, boardId: string, webhookId: string, rcUserId: string, miroUserId: string): Promise<boolean> {
    try {
      const associations: Array<RocketChatAssociationRecord> = [new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `subscription`), new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `webhookId:${webhookId}`), new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `boardId:${boardId}`), new RocketChatAssociationRecord(RocketChatAssociationModel.USER, rcUserId)];
      let subscriptionRecord: ISubscription = {
        webhookId,
        rcUserId,
        boardName,
        boardId,
        miroUserId
      };
      await this.persistence.updateByAssociations(associations, subscriptionRecord, true);
    } catch (error) {
      console.warn('Subscription Error :', error);
      return false;
    }
    return true;
  }


  public async getSubscriptions(rcUserId: string): Promise<Array<ISubscription>> {
    try {
      const associations: Array<RocketChatAssociationRecord> = [new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `subscription`), new RocketChatAssociationRecord(RocketChatAssociationModel.USER, rcUserId)];
      let subscriptions: Array<ISubscription> = (await this.persistenceRead.readByAssociations(associations)) as Array<ISubscription>;
      return subscriptions;
    } catch (error) {
      console.warn('Get Subscription Error :', error);
      let subscriptions: Array<ISubscription> = [];
      return subscriptions;
    }
  }

  public async deleteSubscription(webhookId: string): Promise<boolean> {
    try {
      const associations: Array<RocketChatAssociationRecord> = [new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `subscription`), new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `webhookId:${webhookId}`)];
      await this.persistence.removeByAssociations(associations);
    } catch (error) {
      console.warn('Delete Subscription Error :', error);
      return false;
    }
    return true;
  }


  public async getSubscriptionsByBoardId(boardId: string): Promise<Array<ISubscription>> {
    let subscriptions: Array<ISubscription> = [];
    const associations: Array<RocketChatAssociationRecord> = [new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `subscription`), new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `boardId:${boardId}`)];
    subscriptions = (await this.persistenceRead.readByAssociations(associations)) as Array<ISubscription>;
    return subscriptions;
  }
}