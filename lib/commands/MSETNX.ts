import { transformReplyBoolean } from './generic-transformers';

export function transformArguments(toSet: Array<[string, string]> | Array<string> | Record<string, string>): Array<string> {
    const args = ['MSETNX'];

    if (Array.isArray(toSet)) {
        args.push(...toSet.flat());
    } else {
        for (const key of Object.keys(toSet)) {
            args.push(key, toSet[key]);
        }
    }

    return args;
}

export const transformReply = transformReplyBoolean;