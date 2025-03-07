import { NextFunction, Request, Response } from "express";
import redis, { createClient } from "redis";
const redisClient = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

export async function getRedisData(hash: string, key: string) {
  const data = await redisClient.hGet(hash, key);
  return data ? JSON.parse(data) : null;
}
export async function setRedisData(hash: string, key: string, value: any) {
  await redisClient.hSet(hash, key, value);
  await redisClient.expire(hash, 60);
  return;
}
export async function deleteRedisData(hash: string, key: string) {
  await redisClient.hDel(hash, key);
  return;
}
export default redisClient;
