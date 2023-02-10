import { conflictError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import hotelRepository from '@/repositories/hotel-repository';

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) {
    throw notFoundError;
  }
  return booking;
}

async function postBooking(userId: number, roomId: number) {
  const roomExists = await hotelRepository.findRoom(roomId);
  if (!roomExists) {
    throw notFoundError;
  }
  const roomAvailable = await bookingRepository.findRoomAvailable(roomId);
  if (roomExists.capacity - roomAvailable.length === 0) {
    throw conflictError;
  }
  await bookingRepository.createBooking(userId, roomId);
}

const bookingService = {
  getBooking,
  postBooking,
};

export default bookingService;
