import { Router } from "express";
import { userBookings } from "../controller/booking.js";
import roomPrices from "../controller/room_prices.js";
import { userPass } from "../controller/userPass.js";

const userData = Router();

userData.post('/bookings', userBookings);
userData.get('/room-prices', roomPrices)
userData.post('/applypass', userPass)

export {
    userData
}