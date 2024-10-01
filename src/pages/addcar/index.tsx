import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import styles from "./addcar.module.scss";
import { useState } from "react";
import { CarFormValues } from "@/types/addCarType";
import { useRouter } from "next/router";
import PrivateRoute from "../routes/PrivateRoute";
import { engineTypeChange } from "@/components/helpers/addCarHelpers/addCarHelpers";

const validationSchema = Yup.object({
  brand: Yup.string().required("Введите бренд"),
  model: Yup.string().required("Введите модель"),
  color: Yup.string().required("Введите цвет"),
  price: Yup.string().required("Введите цену"),
  year: Yup.string().required("Введите год"),
  engineType: Yup.string().required("Введите тип двигателя"),
  transmission: Yup.string().required("Введите трансмиссию"),
  range: Yup.string().required("Введите запас хода"),
});

const AddCar = () => {
  const [image, setImage] = useState<File | null>(null);
  const [isElectric, setIsElectric] = useState(false);

  const router = useRouter();

  const handleSubmit = async (values: CarFormValues) => {
    const formData = new FormData();
    formData.append("brand", values.brand);
    formData.append("model", values.model);
    formData.append("color", values.color);

    formData.append("price", values.price ? String(Number(values.price)) : "0");
    formData.append("year", values.year ? String(Number(values.year)) : "0");
    formData.append("range", values.range ? String(Number(values.range)) : "0");

    formData.append("engineType", values.engineType);
    formData.append("transmission", values.transmission);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Автомобиль успешно добавлен!");
        const data = await response.json();
        console.log("Image path:", data.imagePath);
      } else {
        alert("Ошибка при добавлении автомобиля.");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }

    console.log(formData, "formData");
    console.log([...formData.entries()]);

    router.push("/");
  };

  return (
    <PrivateRoute>
      <Formik
        initialValues={{
          brand: "",
          model: "",
          color: "",
          price: "",
          year: "",
          engineType: "",
          transmission: "",
          range: "",
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
          console.log(values, "values");
          resetForm();
        }}
      >
        {({ setFieldValue, errors, touched }) => (
          <Form className={styles.wrapper} noValidate>
            <h1 className={styles.header}>Добавление автомобиля</h1>

            <div className={styles.input}>
              <label htmlFor="brand">Бренд</label>

              <Field
                id="brand"
                name="brand"
                type="text"
                placeholder="Введите бренд"
                className={styles.field}
              />

              {errors.brand && touched.brand ? (
                <div className={styles.error}>{errors.brand}</div>
              ) : null}
            </div>

            <div className={styles.input}>
              <label htmlFor="model">Модель</label>

              <Field
                id="model"
                name="model"
                type="text"
                placeholder="Введите модель"
                className={styles.field}
              />

              {errors.model && touched.model ? (
                <div className={styles.error}>{errors.model}</div>
              ) : null}
            </div>

            <div className={styles.input}>
              <label htmlFor="color">Цвет</label>

              <Field
                id="color"
                name="color"
                type="text"
                placeholder="Введите цвет"
                className={styles.field}
              />

              {errors.color && touched.color ? (
                <div className={styles.error}>{errors.color}</div>
              ) : null}
            </div>

            <div className={styles.input}>
              <label htmlFor="price">Цена</label>

              <Field
                id="price"
                name="price"
                type="text"
                placeholder="Введите цену"
                className={styles.field}
              />

              {errors.price && touched.price ? (
                <div className={styles.error}>{errors.price}</div>
              ) : null}
            </div>

            <div className={styles.input}>
              <label htmlFor="year">Год выпуска</label>

              <Field
                id="year"
                name="year"
                type="text"
                placeholder="Введите год выпуска"
                className={styles.field}
              />

              {errors.year && touched.year ? (
                <div className={styles.error}>{errors.year}</div>
              ) : null}
            </div>

            <div className={styles.input}>
              <label htmlFor="engineType">Тип двигателя</label>

              <Field
                as="select"
                id="engineType"
                name="engineType"
                onChange={(event) => engineTypeChange(event, setFieldValue, setIsElectric)}
                className={styles.field}
              >
                <option value="" label="Выберите тип двигателя" />

                <option value="Бензиновый" label="Бензиновый" />

                <option value="Дизельный" label="Дизельный" />

                <option value="Электрический" label="Электрический" />

                <option value="Гибридный" label="Гибридный" />
              </Field>

              {errors.engineType && touched.engineType ? (
                <div className={styles.error}>{errors.engineType}</div>
              ) : null}
            </div>

            {!isElectric && (
              <div className={styles.input}>
                <label htmlFor="transmission">Трансмиссия</label>

                <Field as="select" id="transmission" name="transmission" className={styles.field}>
                  <option value="" label="Выберите трансмиссию" />

                  <option value="Автоматическая" label="Автоматическая" />

                  <option value="Ручная" label="Ручная" />
                  
                  <option value="Роботизированная" label="Роботизированная" />
                </Field>

                {errors.transmission && touched.transmission ? (
                  <div className={styles.error}>{errors.transmission}</div>
                ) : null}
              </div>
            )}

            <div className={styles.input}>
              <label htmlFor="range">Запас хода (в км)</label>

              <Field
                id="range"
                name="range"
                type="text"
                placeholder="Введите запас хода"
                className={styles.field}
              />

              {errors.range && touched.range ? (
                <div className={styles.error}>{errors.range}</div>
              ) : null}
            </div>

            <div className={styles.input}>
              <label htmlFor="image">Загрузите изображение</label>

              <div className={styles.customFileUpload}>
                <button
                  type="button"
                  onClick={() => document.getElementById("image").click()}
                  className={styles.addButton}
                >
                  Выберите файл
                </button>

                <input
                  id="image"
                  name="image"
                  type="file"
                  onChange={(event) => {
                    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                    setFieldValue("image", file);
                    setImage(file);
                  }}
                  className={styles.hiddenInput}
                />

                {image ? (
                  <div className={styles.fileInfo}>{image.name}</div>
                ) : (
                  <div className={styles.fileInfo}>Файл не выбран</div>
                )}
              </div>
            </div>

            <button className={styles.addButton} type="submit">
              Подтвердить
            </button>
          </Form>
        )}
      </Formik>
    </PrivateRoute>
  );
};

export default AddCar;
