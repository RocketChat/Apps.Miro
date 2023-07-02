import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { UIKitInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitViewSubmitIncomingInteraction } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes';

export interface IGenericAPIFunctionParams {
    context: UIKitViewSubmitInteractionContext;
    data: IUIKitViewSubmitIncomingInteraction;
    room: IRoom;
    read: IRead;
    persistence: IPersistence;
    modify: IModify;
    http: IHttp;
}

export interface IGenericModal { 
    modify: IModify;
    read: IRead; 
    persistence: IPersistence; 
    http: IHttp; 
    slashcommandcontext?: SlashCommandContext; 
    uikitcontext?: UIKitInteractionContext; 
    data?: string; }
