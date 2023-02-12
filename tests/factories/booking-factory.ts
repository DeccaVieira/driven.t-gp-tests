import { prisma } from '@/config';

export async function createBookingFaker(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}
