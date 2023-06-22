import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { MiroApp } from "../../MiroApp";
import { Subcommands } from "../enums/Subcommands";
import { Texts } from "../enums/Texts";
import { sendNotification } from "../lib/message";
import { authorize } from "./subcommands/authorize";
import { getBoards } from "./subcommands/getBoards";

export class Miro implements ISlashCommand {
    public command = "miro-app";
    public i18nParamsExample = "slashcommand_params";
    public i18nDescription = "slashcommand_description";
    public providesPreview = false;

    constructor(private readonly app: MiroApp) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<void> {
        const command = this.getCommandFromContextArguments(context);
        if (!command) {
            return await this.displayAppHelpMessage(
                read,
                modify,
                context.getSender(),
                context.getRoom()
            );
        }

        switch (command) {
            case Subcommands.Help:
                await this.displayAppHelpMessage(
                    read,
                    modify,
                    context.getSender(),
                    context.getRoom()
                );
                break;
            case Subcommands.Auth:
                await authorize(
                    this.app,
                    read,
                    modify,
                    context.getSender(),
                    persistence
                );
                break;
            case Subcommands.GetBoards:
                await getBoards(
                    this.app,
                    read,
                    modify,
                    context.getSender(),
                    persistence,
                    http
                );
                break;
            default:
                await this.displayAppHelpMessage(
                    read,
                    modify,
                    context.getSender(),
                    context.getRoom()
                );
                break;
        }
    }

    private getCommandFromContextArguments(
        context: SlashCommandContext
    ): string {
        const [command] = context.getArguments();
        return command;
    }

    private async displayAppHelpMessage(
        read: IRead,
        modify: IModify,
        user: IUser,
        room: IRoom
    ): Promise<void> {
        const text = Texts.Help;

        return sendNotification(read, modify, user, room, text);
    }
}
