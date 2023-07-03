export const AuthenticationEndpointPath: string = 'auth';
export const SubscriberEndpointPath: string = 'subscriber';

const APIBaseDomain: string = 'https://api.miro.com';
const APIVersionReference = {
    V1: 'v1',
    V2: 'v2',
};
const MiroApiEndpoint = {
    Profile: 'me',
    RevokeRefreshToken: 'me/revokeSignInSessions',
    User: 'users',
    Boards: 'boards',
    Chat: 'chats',
    Oauth: 'oauth',
    Search: 'search',
};

export const getMiroUserProfileUrl = () => {
    return `${APIBaseDomain}/${APIVersionReference.V2}/${MiroApiEndpoint.User}/${MiroApiEndpoint.Profile}`;
};

export const getMiroBoardsUrl = (
    team_id?: string,
    project_id?: string,
    owner?: string,
    query?: string,
  ) => {
    const params: string[] = [];
    if (team_id) params.push(`team_id=${encodeURIComponent(team_id)}`);
    if (project_id) params.push(`project_id=${encodeURIComponent(project_id)}`);
    if (owner) params.push(`owner=${encodeURIComponent(owner)}`);
    if (query) params.push(`query=${encodeURIComponent(query)}`);
    const queryString = params.join('&');
    const url = `${APIBaseDomain}/${APIVersionReference.V2}/${MiroApiEndpoint.Boards}${queryString ? `?${queryString}` : ''}`;
    return url;
};

export const getMiroSearchUrl = () => {
    return `${APIBaseDomain}/${APIVersionReference.V2}/${MiroApiEndpoint.Search}`;
};

export const TestEnvironment = {
    // Put url here when running locally & using tunnel service such as Ngrok to expose the localhost port to the internet
    tunnelServiceUrl: '',
};
