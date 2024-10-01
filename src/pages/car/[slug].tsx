import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Car } from "@/types/cars/carsType";
import Image from "next/image";
import fs from "fs";
import path from "path";
import styles from "./car.module.scss";

const CarDetails = ({ car }: { car: Car }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.carDetails}>
      <h1>
        Автомобиль: {car.brand} {car.model}
      </h1>
      <div>
        <Image src={car.image} alt={car.model} width={400} height={300} className={styles.image}/>
      </div>
      <div className={styles.description}>
        <p>
          <b>Год выпуска:</b> {car.year}
        </p>
        <p>
          <b>Цвет:</b> {car.color}
        </p>
        <p>
          <b>Двигатель:</b> {car.engineType}
        </p>
        {car.engineType === "Бензиновый" || car.transmission === "Дизельный" ? (
          <p>
            <b>Трансмиссия:</b> {car.transmission}
          </p>
        ) : null}
        {car.engineType === "Электрический" ? (
          <p>
            <b>Запас хода:</b> {car.range}
          </p>
        ) : null}
        <p>
          <b>Цена:</b> ${car.price}
        </p>
      </div>
    </div>
  );
};

export default CarDetails;

const createSlug = (model: string) => model.toLowerCase().replace(/\s+/g, "-");

export const getStaticPaths: GetStaticPaths = async () => {
  const filePath = path.join(process.cwd(), "src", "server.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const cars: Car[] = JSON.parse(jsonData);

  const paths = cars.map((car) => ({
    params: { slug: createSlug(car.model) },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params!;

  const filePath = path.join(process.cwd(), "src", "server.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const cars: Car[] = JSON.parse(jsonData);

  const car = cars.find((car) => createSlug(car.model) === slug);

  if (!car) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      car,
    },
  };
};
