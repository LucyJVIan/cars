import { Car } from "@/types/cars/carsType";
import { SortConfig } from "@/types/sort";
import { FilterConfig } from "@/types/filterType";
import { filterCars } from "@/components/utils/filter";
import { sortCars } from "@/components/utils/sorting";

export const getFilteredAndSortedData = (
  cars: Car[],
  filterConfig: FilterConfig,
  sortConfig: SortConfig
) => {
  const filteredCars = filterCars(cars, filterConfig);
  return sortCars(filteredCars, sortConfig);
};

export const getPaginatedData = (
  filteredAndSortedData: Car[],
  currentPage: number,
  itemsPerPage: number
) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredAndSortedData.slice(0, endIndex);
};

export const handleBrandChange = (
  event: React.ChangeEvent<HTMLSelectElement>,
  setFilterConfig: React.Dispatch<React.SetStateAction<FilterConfig>>
) => {
  setFilterConfig((prev) => ({ ...prev, brand: event.target.value }));
};

export const handleColorChange = (
  event: React.ChangeEvent<HTMLSelectElement>,
  setFilterConfig: React.Dispatch<React.SetStateAction<FilterConfig>>
) => {
  setFilterConfig((prev) => ({ ...prev, color: event.target.value }));
};

export const handleButtonSortDirection = (
  key: keyof Car,
  setSortConfig: React.Dispatch<React.SetStateAction<SortConfig>>,
  setSelectedButton: React.Dispatch<React.SetStateAction<string>>
) => {
  setSortConfig((prev) => {
    const newDirection = prev.key === key && prev.direction === "asc" ? "desc" : "asc";
    return { key, direction: newDirection };
  });
  setSelectedButton(key);
};
