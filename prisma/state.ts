import { PrismaClient } from '@prisma/client';

export const findStateByUuid = async (
  prisma: PrismaClient,
  uuid: string
): Promise<State | null> => {
  return prisma.state.findFirst({ where: { uuid } });
};

export const createState = async (
  prisma: PrismaClient,
  options: Pick<State, 'state' | 'secondaryEnvBrand' | 'primaryEnvBrand'>
): Promise<State> => {
  return prisma.state.create({ data: options });
};

export type State = {
  uuid: string;
  state: string;
  secondaryEnvBrand: string | null;
  primaryEnvBrand: string | null;
  createdAt: Date;
  updatedAt: Date;
};
