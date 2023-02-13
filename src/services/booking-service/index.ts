import { conflictError, forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';

async function getBookingService(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
}

async function postBookingService(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
  const roomExists = await hotelRepository.findRoom(roomId);
  if (!roomExists) {
    throw forbiddenError();
  }

  const roomAvailable = await bookingRepository.findRoomAvailable(roomId);
  if (roomExists.capacity - roomAvailable.length === 0) {
    throw notFoundError();
  }
  await bookingRepository.createBooking(userId, roomId);
}

async function putBookingService(userId: number, roomId: number, bookingId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }

  const bookingExists = await bookingRepository.findBookingByBookingId(bookingId);

  if (!bookingExists) {
    throw forbiddenError();
  }

  if (bookingExists.userId !== userId) {
    throw forbiddenError();
  }

  const roomExists = await hotelRepository.findRoom(roomId);
  if (!roomExists) {
    throw forbiddenError();
  }
  const roomAvailable = await bookingRepository.findRoomAvailable(roomId);
  if (roomExists.capacity - roomAvailable.length === 0) {
    throw forbiddenError();
  }

  if (roomExists.Booking.length >= roomExists.capacity) {
    throw forbiddenError();
  }

  return await bookingRepository.putBookingRepository(roomId, bookingId);
}

const bookingService = {
  getBookingService,
  postBookingService,
  putBookingService,
};

export default bookingService;
