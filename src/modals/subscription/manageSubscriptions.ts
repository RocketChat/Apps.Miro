import { IHttp, IModify, IPersistence, IRead, IUIKitSurfaceViewParam } from "@rocket.chat/apps-engine/definition/accessors";
import { ModalsEnum } from "../../enums/Modals";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { Subscription } from "../../storage/subscriptions";
import { ISubscription } from "../../interfaces/external";
import { MiscEnum } from "../../enums/Misc";
import { Block } from "@rocket.chat/ui-kit";
import { getActionsBlock, getButton, getDividerBlock, getSectionBlock } from "../../helpers/blockBuilder";
import { ButtonStyle, UIKitInteractionContext, UIKitSurfaceType } from "@rocket.chat/apps-engine/definition/uikit";
import { getBoardViewUrlFromId } from "../../lib/const";

export async function manageSubscriptionsModal({ modify, read, persistence, http, slashcommandcontext, uikitcontext }: { modify: IModify; read: IRead; persistence: IPersistence; http: IHttp; slashcommandcontext?: SlashCommandContext; uikitcontext?: UIKitInteractionContext }): Promise<IUIKitSurfaceViewParam> {
    const viewId = ModalsEnum.MANAGE_SUBSCRIPTIONS;

    const block: Block[] = [];
    const user = slashcommandcontext?.getSender() || uikitcontext?.getInteractionData().user!;

    let subscriptionStorage = new Subscription(persistence, read.getPersistenceReader());
    let userSubscriptions: Array<ISubscription> = await subscriptionStorage.getSubscriptions(user?.id);

    let dividerblock = await getDividerBlock();
    block.push(dividerblock);

    let index = 1;
    for (let subscription of userSubscriptions) {
      let boardName = subscription.boardName;
      let boardId = subscription.boardId;
      let viewBoardButton = await getButton(MiscEnum.VIEW_BOARD_BUTTON, "", MiscEnum.VIEW_BOARD_ACTION_ID, `${boardId}`, ButtonStyle.PRIMARY, getBoardViewUrlFromId(boardId));
      let boardSectionBlock = await getSectionBlock(`${index}) ${boardName}`, viewBoardButton);
      block.push(boardSectionBlock);

      index++;
    }

    let addSubscriptionButton = await getButton(ModalsEnum.OPEN_ADD_SUBSCRIPTIONS_LABEL, "", ModalsEnum.OPEN_ADD_SUBSCRIPTIONS_MODAL, "");
    let deleteSubscriptionButton = await getButton(ModalsEnum.OPEN_DELETE_SUBSCRIPTIONS_LABEL, "", ModalsEnum.OPEN_DELETE_SUBSCRIPTIONS_MODAL, "");
    let subscriptionRefreshButton = await getButton(ModalsEnum.SUBSCRIPTION_REFRESH_LABEL, "", ModalsEnum.SUBSCRIPTION_REFRESH_ACTION, "");
    let subscriptionActionButton = await getActionsBlock("", [addSubscriptionButton, deleteSubscriptionButton, subscriptionRefreshButton]);

    block.push(dividerblock, subscriptionActionButton);

    let closeButton = await getButton("Close", "", "");

    return {
    id: viewId,
    type: UIKitSurfaceType.MODAL,
    title: {
        type: "plain_text",
        text: ModalsEnum.MANAGE_SUBSCRIPTIONS_TITLE,
    },
    close: closeButton,
    blocks: block,
    };
}