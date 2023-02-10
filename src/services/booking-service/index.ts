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

async function putBooking(userId: number, roomId: number, bookingId: number) {
  const bookingExists = await bookingRepository.findBooking(bookingId);
  if (!bookingExists || bookingExists.userId !== userId) {
    throw notFoundError;
  }
  const roomExists = await hotelRepository.findRoom(roomId);
  if (!roomExists) {
    throw notFoundError;
  }
  const roomAvailable = await bookingRepository.findRoomAvailable(roomId);
  if (roomExists.capacity - roomAvailable.length === 0) {
    throw conflictError;
  }
  return bookingId;
}

const bookingService = {
  getBooking,
  postBooking,
  putBooking
};

export default bookingService;
