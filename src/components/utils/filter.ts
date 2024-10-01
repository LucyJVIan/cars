import { Car } from "@/types/cars/carsType";
import { FilterConfig } from "@/types/filterType";

export const filterCars = (cars: Car[], filters: FilterConfig): Car[] => {
    return cars.filter((car) => {
      const matchesBrand = filters.brand ? car.brand === filters.brand : true;
      const matchesColor = filters.color ? car.color === filters.color : true;
  
      return matchesBrand && matchesColor;
    });
  };