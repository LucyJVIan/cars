import { useRouter } from "next/router";
import { useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import PublicRoute from "../routes/PublicRoute";
import { setAuth } from "@/store/authSlice";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./auth.module.scss";

type FormData = {
  userLogin: string;
  userPassword: string;
};

const validationSchema = Yup.object({
  userLogin: Yup.string().required("Логин обязателен"),
  userPassword: Yup.string().required("Пароль обязателен"),
});

export default function Auth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginError, setLoginError] = useState<string>("");

  const onSubmit = (data: FormData) => {
    if (data.userLogin === "carsGiant" && data.userPassword === "carsGiant") {
      dispatch(setAuth(true));
      Cookies.set("auth", "true");
      router.push("/");
    } else {
      setLoginError("Неправильный логин или пароль");
    }
  };

  return (
    <PublicRoute>
      <div className={styles.groupAuth}>
        <div className={styles.textCenter}>
          <h1>Авторизация</h1>
        </div>

        <Formik
          initialValues={{
            userLogin: "",
            userPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => onSubmit(values)}
        >
          {({ isSubmitting }) => (
            <Form className={styles.loginForm}>
              <div className={styles.formGroup}>
                <Field
                  id="userLogin"
                  name="userLogin"
                  type="text"
                  placeholder="Логин"
                  className={styles.field}
                />
                <ErrorMessage name="userLogin" component="div" className={styles.errorMessage} />
              </div>

              <div className={styles.formGroup}>
                <Field
                  id="userPassword"
                  name="userPassword"
                  type="password"
                  placeholder="Пароль"
                  autoComplete="off"
                  className={styles.field}
                />
                <ErrorMessage name="userPassword" component="div" className={styles.errorMessage} />
                {loginError && <div className={styles.errorMessage}>{loginError}</div>}
              </div>

              <div className={styles.formGroup}>
                <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                  Войти
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </PublicRoute>
  );
}
