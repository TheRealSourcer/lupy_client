#!/bin/bash

concurrently \
  "cd renderer && npm run dev" \
  "wait-on http://localhost:5173 && electron ."
