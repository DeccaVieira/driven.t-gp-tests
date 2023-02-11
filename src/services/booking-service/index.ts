import { conflictError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import hotelRepository from '@/repositories/hotel-repository';

async function getBookingService(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
}

async function postBookingService(userId: number, roomId: number) {
  const roomExists = await hotelRepository.findRoom(roomId);
  if (!roomExists) {
    throw notFoundError();
  }

  const roomAvailable = await bookingRepository.findRoomAvailable(roomId);
  if (roomExists.capacity - roomAvailable.length === 0) {
    throw notFoundError();
  }
  await bookingRepository.createBooking(userId, roomId);
}

async function putBookingService(userId: number, roomId: number, bookingId: number) {
  const bookingExists = await bookingRepository.findBooking(bookingId);
  if (!bookingExists || bookingExists.userId !== userId) {
    throw notFoundError();
  }
  const roomExists = await hotelRepository.findRoom(roomId);
  if (!roomExists) {
    throw notFoundError;
  }
  const roomAvailable = await bookingRepository.findRoomAvailable(roomId);
  if (roomExists.capacity - roomAvailable.length === 0) {
    throw notFoundError();
  }
  return bookingId;
}

const bookingService = {
  getBookingService,
  postBookingService,
  putBookingService
};

export default bookingService;
