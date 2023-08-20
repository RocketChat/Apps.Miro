import {
    IPersistence,
    IPersistenceRead,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';
import {
    IAuthData,
    IOAuth2ClientOptions,
} from '@rocket.chat/apps-engine/definition/oauth2/IOAuth2';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export interface UserModel {
    rocketChatUserId: string;
    miroUserId: string;
}

const assoc = new RocketChatAssociationRecord(
    RocketChatAssociationModel.MISC,
    'users',
);

export const persistUserAsync = async (
    persis: IPersistence,
    rocketChatUserId: string,
    miroUserId: string,
): Promise<void> => {
    const associationsByRocketChatUserId: Array<RocketChatAssociationRecord> = [
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.MISC,
            'User',
        ),
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            rocketChatUserId,
        ),
    ];
    const associationsByMiroUserId: Array<RocketChatAssociationRecord> = [
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.MISC,
            'User',
        ),
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            miroUserId,
        ),
    ];
    const data: UserModel = {
        rocketChatUserId,
        miroUserId,
    };

    await persis.updateByAssociations(
        associationsByRocketChatUserId,
        data,
        true,
    );
    await persis.updateByAssociations(associationsByMiroUserId, data, true);
};

export const retrieveUserByRocketChatUserIdAsync = async (
    read: IRead,
    rocketChatUserId: string,
): Promise<UserModel | null> => {
    const associations: Array<RocketChatAssociationRecord> = [
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.MISC,
            'User',
        ),
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            rocketChatUserId,
        ),
    ];

    const persistenceRead: IPersistenceRead = read.getPersistenceReader();
    const results = await persistenceRead.readByAssociations(associations);

    if (results === undefined || results === null || results.length == 0) {
        return null;
    }

    if (results.length > 1) {
        throw new Error(
            `More than one User record for user ${rocketChatUserId}`,
        );
    }

    const data: UserModel = results[0] as UserModel;
    return data;
};

export const retrieveUserBymiroUserIdAsync = async (
    read: IRead,
    miroUserId: string,
): Promise<UserModel | null> => {
    const associations: Array<RocketChatAssociationRecord> = [
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.MISC,
            'User',
        ),
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            miroUserId,
        ),
    ];

    const persistenceRead: IPersistenceRead = read.getPersistenceReader();
    const results = await persistenceRead.readByAssociations(associations);

    if (results === undefined || results === null || results.length == 0) {
        return null;
    }

    if (results.length > 1) {
        throw new Error(`More than one User record for user ${miroUserId}`);
    }

    const data: UserModel = results[0] as UserModel;
    return data;
};

export const retrieveSubscribedUsersByBoardIdAsync = async (
    read: IRead,
    boardId: string,
): Promise<Array<UserModel> | null> => {
    const associations: Array<RocketChatAssociationRecord> = [
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.MISC,
            'User',
        ),
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            boardId,
        ),
    ];

    const persistenceRead: IPersistenceRead = read.getPersistenceReader();
    const results = await persistenceRead.readByAssociations(associations);

    if (results === undefined || results === null || results.length == 0) {
        return null;
    }

    const data: Array<UserModel> = results as Array<UserModel>;
    return data;
};


export async function create(
    read: IRead,
    persistence: IPersistence,
    user: IUser,
): Promise<void> {
    const users = await getAllUsers(read);

    if (!users) {
        await persistence.createWithAssociation([user], assoc);
        return;
    }

    if (!isUserPresent(users, user)) {
        users.push(user);
        await persistence.updateByAssociation(assoc, users);
    }
}

export async function remove(
    read: IRead,
    persistence: IPersistence,
    user: IUser,
): Promise<void> {
    const users = await getAllUsers(read);

    if (!users || !isUserPresent(users, user)) {
        // @NOTE do nothing
        return;
    }

    const idx = users.findIndex((u: IUser) => u.id === user.id);
    users.splice(idx, 1);
    await persistence.updateByAssociation(assoc, users);
}

export async function getAllUsers(read: IRead): Promise<Array<IUser>> {
    const data = await read.getPersistenceReader().readByAssociation(assoc);
    return data.length ? (data[0] as Array<IUser>) : [];
}

function isUserPresent(users: Array<IUser>, targetUser: IUser): boolean {
    return users.some((user) => user.id === targetUser.id);
}

/**
 * This function needed to be copied from the apps engine due to difficulties trying to
 * get access to the auth client from inside a job processor.
 * @NOTE It relies on hardcoded information (config alias's suffix) to work and it might break if
 * the value changes
 */
export async function getAccessTokenForUser(
    read: IRead,
    user: IUser,
): Promise<IAuthData | undefined> {
    const associations = [
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            user.id,
        ),
        new RocketChatAssociationRecord(
            RocketChatAssociationModel.MISC,
            `miro-app-oauth-connection`,
        ),
    ];

    const [result] = (await read
        .getPersistenceReader()
        .readByAssociations(associations)) as unknown as Array<
        IAuthData | undefined
    >;

    return result;
}
