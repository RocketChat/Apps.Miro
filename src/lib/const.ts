import { IApiEndpointMetadata } from '@rocket.chat/apps-engine/definition/api';
import { IAppAccessors } from "@rocket.chat/apps-engine/definition/accessors";

import { MiroApp } from '../../MiroApp';

export const AuthenticationEndpointPath: string = 'auth';
export const SubscriberEndpointPath: string = 'subscriber';

const APIBaseDomain: string = 'https://api.miro.com';
const APIDomainRoute: string = 'https://miro.com/api';
const APIVersionReference = {
    V1: 'v1',
    V2: 'v2',
    V2E: 'v2-experimental'
};
const MiroApiEndpoint = {
    Profile: 'me',
    RevokeRefreshToken: 'me/revokeSignInSessions',
    Member: 'members',
    User: 'users',
    Boards: 'boards',
    Chat: 'chats',
    Oauth: 'oauth',
    Search: 'search',
    Webhooks: 'webhooks',
    BoardSubscriptions: 'board_subscriptions',
    Subscriptions: 'subscriptions',
    oEmbed: 'oembed'
};

export const getMiroUserProfileUrl = () => {
    return `${APIBaseDomain}/${APIVersionReference.V2}/${MiroApiEndpoint.User}/${MiroApiEndpoint.Profile}`;
};

export const getBoardsUrl = (
    team_id?: string,
    project_id?: string,
    owner?: string,
    query?: string,
  ) => {
    const params: Array<string> = [];
    if (team_id) { params.push(`team_id=${encodeURIComponent(team_id)}`); }
    if (project_id) { params.push(`project_id=${encodeURIComponent(project_id)}`); }
    if (owner) { params.push(`owner=${encodeURIComponent(owner)}`); }
    if (query) { params.push(`query=${encodeURIComponent(query)}`); }
    const queryString = params.join('&');
    const url = `${APIBaseDomain}/${APIVersionReference.V2}/${MiroApiEndpoint.Boards}${queryString ? `?${queryString}` : ''}`;
    return url;
};

export const getSpecificBoardsUrl = (board_id: string) => {
    return `${APIBaseDomain}/${APIVersionReference.V2}/${MiroApiEndpoint.Boards}/${board_id}`;
};

export const getBoardMembersUrl = (board_id: string, member_id?: string) => {
    return `${APIBaseDomain}/${APIVersionReference.V2}/${MiroApiEndpoint.Boards}/${board_id}/${MiroApiEndpoint.Member}${member_id ? `?/${member_id}` : ''}`;
};

export const getMiroSearchUrl = () => {
    return `${APIBaseDomain}/${APIVersionReference.V2}/${MiroApiEndpoint.Search}`;
};

export const getBoardViewUrlFromId = (board_id: string) => {
    return `https://miro.com/app/board/${board_id}`
}

export const getWebhookUrl = async (appAccessors: IAppAccessors, appEndpointPath: string) => {
    const webhookEndpoint: IApiEndpointMetadata = appAccessors.providedApiEndpoints.find((endpoint) => endpoint.path === appEndpointPath) as IApiEndpointMetadata;
    let siteUrl: string = await appAccessors.environmentReader.getServerSettings().getValueById("Site_Url");
    siteUrl = siteUrl.slice(-1) === "/" ? siteUrl.substring(0, siteUrl.length - 1) : siteUrl;

    return siteUrl + webhookEndpoint.computedPath;
}

export const getWebhookSubscriptionUrl = () => {
    return `${APIBaseDomain}/${APIVersionReference.V2E}/${MiroApiEndpoint.Webhooks}/${MiroApiEndpoint.BoardSubscriptions}`;
};

export const getSubscriptionUrl = (subscription_id: string) => {
    return `${APIBaseDomain}/${APIVersionReference.V2E}/${MiroApiEndpoint.Webhooks}/${MiroApiEndpoint.Subscriptions}/${subscription_id}`;
};

export const getoEmbedDataUrl = (board_url: string) => {
    return `${APIDomainRoute}/${APIVersionReference.V1}/${MiroApiEndpoint.oEmbed}?url=${board_url}`;
};

export const TestEnvironment = {
    // Put url here when running locally & using tunnel service such as Ngrok to expose the localhost port to the internet
    tunnelServiceUrl: '',
};
