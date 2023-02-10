import { prisma } from '@/config';

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
  });
}
async function findRoomAvailable(roomId: number) {
  return prisma.booking.findMany({
    where: {
      id: roomId,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId
    },
  });
}

const bookingRepository = {
  findBooking,
  findRoomAvailable,
  createBooking
};

export default bookingRepository;
