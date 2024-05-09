import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findStateByUuid = async (uuid: string): Promise<State | null> => {
  return prisma.state.findFirst({ where: { uuid } });
};

export const createState = async (
  options: Pick<State, 'state'>
): Promise<State> => {
  return prisma.state.create({ data: options });
};

export type State = {
  uuid: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
};
