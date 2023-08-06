import { IHttp, IModify, IPersistence, IRead, IUIKitSurfaceViewParam } from "@rocket.chat/apps-engine/definition/accessors";
import { ModalsEnum } from "../../enums/Modals";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { UIKitInteractionContext, UIKitSurfaceType } from "@rocket.chat/apps-engine/definition/uikit";

import { Block } from "@rocket.chat/ui-kit";
import { getButton, getDividerBlock, getInputBox, getSectionBlock } from "../../helpers/blockBuilder";
import { IGenericModal } from "../../interfaces/external";

export async function addSubscriptionModal({ modify, read, persistence, http, slashcommandcontext, uikitcontext, data }: IGenericModal): Promise<IUIKitSurfaceViewParam> {
    const viewId = ModalsEnum.ADD_SUBSCRIPTION
    const board_id = data;
    const block: Block[] = [];
    const room = slashcommandcontext?.getRoom() || uikitcontext?.getInteractionData().room;
    const user = slashcommandcontext?.getSender() || uikitcontext?.getInteractionData().user;
    if (!data) {
        const textSectionBlock = await getSectionBlock("This is the naive way to subscribe to board notifications! \nPlease use get-boards subcommand to auto-fill board id!");
        block.push(textSectionBlock);
    }
    let boardIdInputBox = await getInputBox(ModalsEnum.BOARD_ID_LABEL, ModalsEnum.BOARD_ID_PLACEHOLDER, ModalsEnum.BOARD_ID_BLOCK, ModalsEnum.BOARD_ID_INPUT, board_id || "");
    block.push(boardIdInputBox);
    
    let dividerBlock = await getDividerBlock();
    block.push(dividerBlock);

    let closeButton = await getButton("Close", "", "");
    let submitButton = await getButton("Subscribe", "", ModalsEnum.ADD_SUBSCRIPTION);

    return {
    id: viewId,
    type: UIKitSurfaceType.MODAL,
    title: {
        type: "plain_text",
        text: ModalsEnum.ADD_SUBSCIPTIONS_TITLE,
    },
    close: closeButton,
    submit: submitButton,
    blocks: block,
    };
}