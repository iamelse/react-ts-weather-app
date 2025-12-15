export const formatLocationName = (name: string) => {
  return name.split(",").slice(0, 3).join(", ");
};