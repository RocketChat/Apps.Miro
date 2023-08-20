import { IAppAccessors, IAppInstallationContext, IConfigurationExtend, IHttp, ILogger, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IAuthData, IOAuth2Client, IOAuth2ClientOptions,} from '@rocket.chat/apps-engine/definition/oauth2/IOAuth2';
import { createOAuth2Client } from '@rocket.chat/apps-engine/definition/oauth2/OAuth2';
import { IUIKitResponse, UIKitBlockInteractionContext, UIKitViewSubmitInteractionContext, UIKitActionButtonInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Block } from '@rocket.chat/ui-kit';
import { Texts } from './src/enums/Texts';
import { ExecuteBlockActionHandler } from './src/handlers/actionHandler';
import { ExecuteViewSubmitHandler } from './src/handlers/submitHandler';
import { ExecuteActionButtonHandler } from './src/handlers/actionButtonHandler';
import { getSectionBlock } from './src/helpers/blockBuilder';
import { getMiroUserProfileUrl } from './src/lib/const';
import { isUserHighHierarchy, sendDirectMessage } from './src/lib/message';
import { Miro as MiroCommand } from './src/slashcommands/miro';
import { persistUserAsync } from './src/storage/users';
import { MiscEnum } from './src/enums/Misc';
import { UIActionButtonContext } from '@rocket.chat/apps-engine/definition/ui';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { miroWebhook } from './src/endpoints/incoming'

export class MiroApp extends App {
    public botUsername: string;
    public botUser: IUser;
    
    private oauth2ClientInstance: IOAuth2Client;
    private oauth2Config: IOAuth2ClientOptions = {
        alias: 'miro-app',
        accessTokenUri: 'https://api.miro.com/v1/oauth/token',
        authUri: 'https://miro.com/oauth/authorize',
        refreshTokenUri: 'https://api.miro.com/v1/oauth/token',
        revokeTokenUri: 'https://api.miro.com/v1/oauth/revoke',
        defaultScopes: ['boards:read', 'boards:write'],
        authorizationCallback: this.autorizationCallback.bind(this),
    };

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async onInstall(context: IAppInstallationContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<void> {
        const user = context.user;

        const quickReminder = Texts.QuickReminder;

        const welcomeText = Texts.Welcome;
        +`${isUserHighHierarchy(user) ? quickReminder : ''}`;

        await sendDirectMessage(read, modify, user, welcomeText, persistence);
    }

    public getOauth2ClientInstance(): IOAuth2Client {
        if (!this.oauth2ClientInstance) {
            this.oauth2ClientInstance = createOAuth2Client(this, this.oauth2Config);
        }
        return this.oauth2ClientInstance;
    }

    public async onEnable(): Promise<boolean> {
        this.botUsername = 'Miro-app.bot';
        this.botUser = (await this.getAccessors().reader.getUserReader().getByUsername(this.botUsername)) as IUser;
        return true;
    }

    public async executeActionButtonHandler(context: UIKitActionButtonInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        const handler = new ExecuteActionButtonHandler(this, read, http, modify, persistence);
        return await handler.run(context);
    }

    public async executeBlockActionHandler(context: UIKitBlockInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        const handler = new ExecuteBlockActionHandler(this, read, http, modify, persistence);
        return await handler.run(context);
      }

    public async executeViewSubmitHandler(context: UIKitViewSubmitInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify) {
        const handler = new ExecuteViewSubmitHandler(this, read, http, modify, persistence);
        return await handler.run(context);
      }

    protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        await Promise.all([this.getOauth2ClientInstance().setup(configuration), configuration.slashCommands.provideSlashCommand(new MiroCommand(this))]);
        configuration.ui.registerButton({
            actionId: MiscEnum.CREATE_BOARD_ACTION_ID,
            labelI18n: 'create-board-label',
            context: UIActionButtonContext.ROOM_ACTION
        });
        configuration.ui.registerButton({
            actionId: MiscEnum.VIEW_EMBEDDED_BOARDS_ACTION_ID,
            labelI18n: 'view-embedded-boards-label',
            context: UIActionButtonContext.ROOM_ACTION
        });
        configuration.api.provideApi({
        visibility: ApiVisibility.PUBLIC,
        security: ApiSecurity.UNSECURE,
        endpoints: [new miroWebhook(this)],
        });
    }

    private async autorizationCallback(token: IAuthData, user: IUser, read: IRead, modify: IModify, http: IHttp, persistence: IPersistence) {
        if (token) {
            const headers = {
                Authorization: `Bearer ${token?.token}`,
            };
            const url = getMiroUserProfileUrl();
            const userData = await http.get(url, { headers });
            if (userData.statusCode == HttpStatusCode.OK) {
                await persistUserAsync(persistence, user.id, userData.data.id);
            }
        }
        const successAuthText = Texts.AuthSuccess;
        const block: Array<Block> = [];
        const sectionBlock = await getSectionBlock(successAuthText);

        block.push(sectionBlock);

        await sendDirectMessage(read, modify, user, successAuthText, persistence, block);
    }
}
