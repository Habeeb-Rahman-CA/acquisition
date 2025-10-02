import express from 'express';

const router = express.Router();

router.post('/sign-up', (req, res) => {
  res.send('POST');
});

router.post('/sign-in', (req, res) => {
  res.send('POST');
});

router.post('/sign-out', (req, res) => {
  res.send('POST');
});

export default router;
