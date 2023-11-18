import {getFromEnv} from "../env";

export * from './meal-plans';
export * from './shopping-list';

export function getApiKey() {
    const apiToken = getFromEnv('MEALIE_API_TOKEN');
    if (!apiToken) {
        throw new Error('API token not found');
    }

    return apiToken;
}

export function getFullApiUrl(path: string) {
    const baseUrl = getFromEnv('MEALIE_API_BASE_URL');

    return `${baseUrl}/api${path}`;
}

export async function fetchApi<TResponse>(path: string, params?: RequestInit) {
    const apiKey = getApiKey();

    const url = getFullApiUrl(path);

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json',
        },
        ...params,
    });

    if (!response.ok) {
        console.error(await response.text());
        throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.clone().json() as TResponse;
}
