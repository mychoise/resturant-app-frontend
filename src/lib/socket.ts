// lib/socket.ts
import { io } from "socket.io-client";

const token =
  "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzZTQxNGQ2MS1hYTMzLTRhMGUtYjFhNC0yZjNkNTEyMDg4MmMiLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaHNza2tuQGV4YW1wbGUuY29tIiwicm9sZSI6IndhaXRlciIsImlhdCI6MTc4MTg1Njg1MCwiZXhwIjoxNzgxODg1NjUwfQ.FWmXIg1zwQlTPp6LB9Csta024rtWb2elNDQUmElPgw8";

export const socket = io(`http://localhost:3000?${token}`, {
  autoConnect: false,
});
