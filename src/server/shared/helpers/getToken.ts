import { type Request } from 'express';

// get token from headers
const getToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  const token: string = authHeader?.split(' ')[1] ?? '';

  return token;
};

export default getToken;
