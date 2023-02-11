import { prisma } from '@/config';

//Sabe criar objetos - Hotel do banco
export async function createBookingFaker(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      roomId: roomId,
      userId: userId,
    },
  });
}
