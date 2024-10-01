import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Car } from "@/types/cars/carsType";
import { SortConfig } from "@/types/sort";
import { FilterConfig } from "@/types/filterType";
import {
  getFilteredAndSortedData,
  getPaginatedData,
  handleBrandChange,
  handleColorChange,
  handleButtonSortDirection,
} from "@/components/helpers/carsListHelper/carsListHelper";
import styles from "./carsList.module.scss";

export const CarsList = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const router = useRouter();

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "", direction: "asc" });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({ brand: "", color: "" });

  useEffect(() => {
    fetch("/api/cars")
      .then((response) => response.json())
      .then((data: Car[]) => setCars(data))
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  }, []);

  const cardClick = (model: string) => {
    const slug = model.toLowerCase().replace(/\s+/g, "-");
    router.push(`/car/${slug}`);
  };

  const filteredAndSortedData = useMemo(() => {
    return getFilteredAndSortedData(cars, filterConfig, sortConfig);
  }, [cars, filterConfig, sortConfig]);

  const paginatedData = useMemo(() => {
    return getPaginatedData(filteredAndSortedData, currentPage, itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  return (
    <div>
      <h1 className={styles.header}>Список автомобилей</h1>

      <div className={styles.wrapper}>
        <div className={styles.sort}>
          <button
            className={`
              ${
                selectedButton === "price"
                  ? sortConfig.direction === "asc"
                    ? styles.buttonSortUp
                    : styles.buttonSortDown
                  : styles.buttonSortDown
              }`}
            onClick={() => handleButtonSortDirection("price", setSortConfig, setSelectedButton)}
          >
            Сортировка по цене
          </button>

          <button
            className={`
              ${
                selectedButton === "year"
                  ? sortConfig.direction === "asc"
                    ? styles.buttonSortUp
                    : styles.buttonSortDown
                  : styles.buttonSortDown
              }`}
            onClick={() => handleButtonSortDirection("year", setSortConfig, setSelectedButton)}
          >
            Сортировка по году выпуска
          </button>
        </div>

        <div className={styles.sort}>
          <div className={styles.filter}>
            <label htmlFor="brand-filter">Фильтр по марке:</label>
            <select id="brand-filter" onChange={(e) => handleBrandChange(e, setFilterConfig)}>
              <option value="">Все марки</option>
              {filteredAndSortedData.map((filteredCar) => (
                <option key={filteredCar.id} value={filteredCar.brand}>
                  {filteredCar.brand}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filter}>
            <label htmlFor="color-filter">Фильтр по цвету:</label>
            <select id="color-filter" onChange={(e) => handleColorChange(e, setFilterConfig)}>
              <option value="">Все цвета</option>
              {filteredAndSortedData.map((filteredCar) => (
                <option key={filteredCar.id} value={filteredCar.color}>
                  {filteredCar.color}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className={styles.addButton} onClick={() => router.push("/addcar")}>
          Добавить автомобиль
        </button>
      </div>

      <div className={styles.cars}>
        <ul className={styles.carsList}>
          {paginatedData.map((car) => (
            <li key={car.id} onClick={() => cardClick(car.model)}>
              <div className={styles.imageWrapper}>
                <Image
                  src={car.image}
                  alt={`car-${car.brand}`}
                  width={400}
                  height={300}
                  className={styles.image}
                />
              </div>

              <div className={styles.miniDescription}>
                <p>
                  <b>Бренд:</b> {car.brand}
                </p>
                <p>
                  <b>Модель:</b> {car.model}
                </p>
                <p>
                  <b>Год выпуска:</b> {car.year}
                </p>
                <p>
                  <b>Цена:</b> $ {car.price}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {paginatedData.length < filteredAndSortedData.length && (
          <div className={styles.addButtonCenter}>
            <button className={styles.addButton} onClick={() => setCurrentPage((prev) => prev + 1)}>
              Загрузить ещё
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
