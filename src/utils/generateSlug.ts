import { UserModel } from "../models/user.model";

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") 
    .replace(/\s+/g, "-"); 
};

export async function generateUniqueSlug(name: string): Promise<string> {
  let slug = generateSlug(name);
  let counter = 0;
  let uniqueSlug = slug;

  // Keep checking until we find a unique slug
  while (await UserModel.findOne({ slug: uniqueSlug })) {
    counter++;
    uniqueSlug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  return uniqueSlug;
}
