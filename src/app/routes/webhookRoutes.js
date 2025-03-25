// src/app/routes/webhookRoutes.js
import express from 'express';
import { handleNewMessage } from "../../websocket/socketHandlers.js";

const webhookRoutes = (io) => {
  const router = express.Router();

  router.post('/zalo', (req, res) => {
    const message = req.body;
    handleNewMessage(io, message); // send to socketIO internal
    res.sendStatus(200);
  });

  return router;
};

export default webhookRoutes;
