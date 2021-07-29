export const jwtConstants = {
  secret: `${process.env.JWT_SECRET_KEY}`,
  expiresIn: 3600 * 1000,
};
