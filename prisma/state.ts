import { PrismaClient } from '@prisma/client';

export const findStateByUuid = async (
  prisma: PrismaClient,
  uuid: string
): Promise<State | null> => {
  return prisma.state.findFirst({ where: { uuid } });
};

export const createState = async (
  prisma: PrismaClient,
  options: Pick<State, 'state' | 'dummyBrand' | 'realBrand'>
): Promise<State> => {
  return prisma.state.create({ data: options });
};

export type State = {
  uuid: string;
  state: string;
  dummyBrand: string;
  realBrand: string;
  createdAt: Date;
  updatedAt: Date;
};
