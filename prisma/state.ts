import { PrismaClient } from '../app/generated/client';

const prisma = new PrismaClient();

export const findStateByUuid = async (uuid: string): Promise<State | null> => {
  try {
    prisma.$connect();
    return prisma.state.findFirst({ where: { uuid } });
  } finally {
    prisma.$disconnect();
  }
};

export const createState = async (
  options: Pick<State, 'state' | 'dummyBrand' | 'realBrand'>
): Promise<State> => {
  try {
    prisma.$connect();
    return await prisma.state.create({ data: options });
  } finally {
    prisma.$disconnect();
  }
};

export type State = {
  uuid: string;
  state: string;
  dummyBrand: string;
  realBrand: string;
  createdAt: Date;
  updatedAt: Date;
};
