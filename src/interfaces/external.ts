import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { UIKitActionButtonInteractionContext, UIKitBlockInteractionContext, UIKitInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitViewSubmitIncomingInteraction } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes';
import { IUIKitBaseIncomingInteraction } from "@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes";

export interface ISubmitGenericAPIFunctionParams {
    context: UIKitViewSubmitInteractionContext;
    data: IUIKitViewSubmitIncomingInteraction;
    room: IRoom;
    read: IRead;
    persistence: IPersistence;
    modify: IModify;
    http: IHttp;
}

export interface IBlockGenericAPIFunctionParams {
    context: UIKitBlockInteractionContext;
    data: IUIKitBaseIncomingInteraction;
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
    actionbuttoncontext?: UIKitActionButtonInteractionContext;
    data?: any; }
