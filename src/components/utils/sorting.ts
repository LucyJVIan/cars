import { Car } from "@/types/cars/carsType";
import { SortConfig } from "@/types/sort";

export const sortCars = (cars: Car[], sortConfig: SortConfig): Car[] => {
  if (!cars || !sortConfig.key) return cars;

  return [...cars].sort((a, b) => {
    const key = sortConfig.key as keyof Car;
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
};

export const requestSort = (
  key: keyof Car,
  sortConfig: SortConfig,
  setSortConfig: (config: SortConfig) => void
) => {
  let direction: "asc" | "desc" = "asc";
  if (sortConfig.key === key && sortConfig.direction === "asc") {
    direction = "desc";
  }
  setSortConfig({ key, direction });
};
