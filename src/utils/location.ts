export const formatLocationName = (name: string): string => {
  return name.split(",").slice(0, 3).join(", ");
};