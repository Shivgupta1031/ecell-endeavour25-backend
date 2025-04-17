import jwt from "jsonwebtoken";
interface UserPayload {
  id: string;
  email: string;
  name: string;
  role?: string;
  slug?: string;
  isAdmin: Boolean;
  isSuperAdmin: Boolean,
}

export const generateToken = (user: Partial<UserPayload>): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      slug: user.slug,
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "24h" }
  );
};
