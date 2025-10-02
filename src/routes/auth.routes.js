import { signup } from '#controller/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/sign-up', signup);

router.post('/sign-in', (req, res) => {
  res.send('POST');
});

router.post('/sign-out', (req, res) => {
  res.send('POST');
});

export default router;
