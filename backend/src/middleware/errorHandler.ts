import type { ErrorRequestHandler } from "express";

// Final safety net: Express 5 forwards rejected promises from async route
// handlers here automatically, so anything that slips past a route's own
// try/catch still gets a JSON response instead of Express's default HTML
// error page (or a hung connection).
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) {
    next(err);
    return;
  }
  res.status(500).json({ error: "Something went wrong" });
};
