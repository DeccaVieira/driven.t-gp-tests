import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBookingService(Number(userId));
    return res.status(httpStatus.OK).send({ id: booking.id, Room: booking.Room });
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body;
  const { userId } = req;
  try {
    await bookingService.postBookingService(Number(userId), Number(roomId));
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { bookingId } = req.params;
  const { userId } = req;
  const { roomId } = req.body;
  try {
    await bookingService.putBookingService(Number(userId), Number(roomId), parseInt(bookingId));
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === 'forbiddenError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if(error.name === 'CannotListHotelsError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
