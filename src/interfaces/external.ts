import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { UIKitActionButtonInteractionContext, UIKitBlockInteractionContext, UIKitInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitViewSubmitIncomingInteraction } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes';
import { IUIKitBaseIncomingInteraction } from "@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes";
import { MiroApp } from '../../MiroApp';

export interface ISubmitGenericAPIFunctionParams {
    app: MiroApp,
    context: UIKitViewSubmitInteractionContext;
    data: IUIKitViewSubmitIncomingInteraction;
    room: IRoom;
    read: IRead;
    persistence: IPersistence;
    modify: IModify;
    http: IHttp;
}

export interface IBlockGenericAPIFunctionParams {
    app: MiroApp,
    context: UIKitBlockInteractionContext;
    data?: IUIKitBaseIncomingInteraction;
    room: IRoom;
    read: IRead;
    persistence?: IPersistence;
    modify: IModify;
    http: IHttp;
    extra?: any;
}

export interface IGenericModal {
    app: MiroApp,
    modify: IModify;
    read: IRead;
    persistence: IPersistence;
    http: IHttp;
    slashcommandcontext?: SlashCommandContext;
    uikitcontext?: UIKitInteractionContext;
    actionbuttoncontext?: UIKitActionButtonInteractionContext;
    data?: any; }

export interface ISubscription{
    webhookId : string,
    rcUserId: string, 
    miroUserId: string,
    boardName : string,
    boardId : string
}

export interface IOEmbedResponse {
    html: string;
    title: string;
    version: string;
    type: string;
    thumbnail_url: string;
    thumbnail_width: number;
    thumbnail_height: number;
    width: number;
    height: number;
    provider_name: string;
    provider_url: string;
  }

  export interface IEmbeddedBoard{
    boardUrl : string,
    roomId: string, 
    boardName : string,
    boardId : string
}
