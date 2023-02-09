import { Router } from "express";
import { authenticateToken } from "@/middlewares";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/booking")
  .post("/booking")
  .put("/booking/:bookingId");

export { bookingRouter };