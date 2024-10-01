import { CarsList } from "@/components/carsList/CarsList";
import { FC } from "react";
import styles from "./index.module.scss"

const Home: FC = ({}) => {
  return (
    <div className={styles.main}>
      <main>
        <CarsList />
      </main>
    </div>
  );
};
export default Home;
