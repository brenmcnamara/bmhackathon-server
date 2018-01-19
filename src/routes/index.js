/* @flow */

import express from 'express';

const router = express.Router();

export function initialize(): void {
  console.log('initializing routes');
}

router.get('/status', (req, res) => {
  res.json({
    status: 'RUNNING',
  });
});

export default router;
