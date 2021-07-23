export const jwtConstants = {
  secret: `${process.env.JWT_SECRET_KEY}`,
  expiresIn: 24 * 3600 * 1000,
};
