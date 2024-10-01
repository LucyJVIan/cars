import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RootState } from "@/store/store";
import Cookies from "js-cookie";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const router = useRouter();

  useEffect(() => {
    const auth = Cookies.get("auth");
    if (!auth) {
      router.push("/auth");
    }
  }, [router, isAuth]);

  return <>{children}</>;
};

export default PrivateRoute;
