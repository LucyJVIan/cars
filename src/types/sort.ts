import { Car } from "./cars/carsType";

export type SortConfig = {
  key: keyof Car | "";
  direction: "asc" | "desc";
};
