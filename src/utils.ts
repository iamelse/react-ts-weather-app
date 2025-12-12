/**
 * Format temperature to integer
 * Bisa dipakai di mana saja
 */
export const formatTemp = (temp: number): number => Math.round(temp);

/**
 * Format temperature to string with unit
 */
export const formatTempDisplay = (temp: number): string => {
  return Math.round(temp).toString(); 
};