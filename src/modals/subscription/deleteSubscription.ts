import { IUIKitSurfaceViewParam } from "@rocket.chat/apps-engine/definition/accessors";
import { ModalsEnum } from "../../enums/Modals";
import { ButtonStyle, UIKitSurfaceType } from "@rocket.chat/apps-engine/definition/uikit";
import { Block } from "@rocket.chat/ui-kit";
import { getButton, getDividerBlock, getSectionBlock } from "../../helpers/blockBuilder";
import { IGenericModal, ISubscription } from "../../interfaces/external";
import { Subscription } from "../../storage/subscriptions";
import { MiscEnum } from "../../enums/Misc";

export async function deleteSubscriptionModal({ app, modify, read, persistence, http, slashcommandcontext, uikitcontext, data }: IGenericModal): Promise<IUIKitSurfaceViewParam> {
  const viewId = ModalsEnum.DELETE_SUBSCRIPTIONS;

  const block: Block[] = [];
  const user = slashcommandcontext?.getSender() || uikitcontext?.getInteractionData().user!;

  let subscriptionStorage = new Subscription(app, persistence, read.getPersistenceReader());
  let userSubscriptions: Array<ISubscription> = await subscriptionStorage.getSubscriptions(user?.id);

  let dividerblock = await getDividerBlock();
  block.push(dividerblock);

  let index = 1;
  for (let subscription of userSubscriptions) {
    let boardName = subscription.boardName;
    let boardId = subscription.boardId;
    let webhookId = subscription.webhookId;
    let deleteBoardButton = await getButton(MiscEnum.DELETE_SUBSCRIPTION_BUTTON, "", MiscEnum.DELETE_SUBSCRIPTION_ACTION_ID, webhookId, ButtonStyle.DANGER);
    let boardSectionBlock = await getSectionBlock(`${index}) ${boardName}`, deleteBoardButton);
    block.push(deleteBoardButton, boardSectionBlock);
    index++;
  }

  let closeButton = await getButton("Close", "", "");

  return {
    id: viewId,
    type: UIKitSurfaceType.MODAL,
    title: {
        type: "plain_text",
        text: ModalsEnum.DELETE_SUBSCIPTIONS_TITLE,
    },
    close: closeButton,
    blocks: block,
  };
}