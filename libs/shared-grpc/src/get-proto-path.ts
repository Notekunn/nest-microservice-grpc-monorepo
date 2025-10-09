import { resolve } from 'path';

const protoDir = resolve(process.cwd(), 'dist/libs/shared-grpc', 'proto');

export const getProtoPath = (protoName: string | string[]) => {
  if (Array.isArray(protoName)) {
    return protoName.map((name) => resolve(protoDir, `${name}.proto`));
  }

  return resolve(protoDir, `${protoName}.proto`);
};
