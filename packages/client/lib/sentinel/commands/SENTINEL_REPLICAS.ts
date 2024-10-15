import { RedisArgument, ArrayReply, BlobStringReply, MapReply, Command, TypeMapping, UnwrapReply } from '../../RESP/types';
import { transformTuplesReply } from '../../commands/generic-transformers';

export default {
  transformArguments(dbname: RedisArgument) {
    return ['SENTINEL', 'REPLICAS', dbname];
  },
  transformReply: {
    2: (reply: ArrayReply<ArrayReply<BlobStringReply>>, preserve?: any, typeMapping?: TypeMapping) => {
      const inferred = reply as unknown as UnwrapReply<typeof reply>;
      const initial: Array<MapReply<BlobStringReply, BlobStringReply>> = [];

      return inferred.reduce(
        (sentinels: Array<MapReply<BlobStringReply, BlobStringReply>>, x: ArrayReply<BlobStringReply>) => {
          sentinels.push(transformTuplesReply(x, undefined, typeMapping)); 
          return sentinels;
        }, 
        initial
      );
    },
    3: undefined as unknown as () => ArrayReply<MapReply<BlobStringReply, BlobStringReply>>
  }
} as const satisfies Command;