"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/UserAuthContent";
import PulseLoader from "react-spinners/PulseLoader";

export default function UserPrivateRoutes(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [initializing, setInitializing] = useState(true);

    const router = useRouter();

    useEffect(() => {
      const initializeAuth = () => {
        if (!auth?.token) {
          const storedAuth = localStorage.getItem("auth");
          if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
          }
        }
        setInitializing(false);
      };

      initializeAuth();
    }, [auth, setAuth]);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/users/userAuth`,
            {
              headers: {
                authorization: auth?.token,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };

      if (!initializing && auth?.token) {
        checkAuth();
      } else if (!initializing) {
        setLoading(false);
      }
    }, [auth?.token, initializing]);

    // Show loading spinner while initializing or checking authentication
    if (loading || initializing) {
      return (
        <div className="flex justify-center w-100 h-screen items-center gap-4">
          <p className="font-bold text-3xl">
            {initializing
              ? "Initializing Authentication"
              : "Checking Authentication"}
          </p>
          <PulseLoader />
        </div>
      );
    }

    if (!isAuthenticated) {
      router.push("/");
      return (
        <div className="flex justify-center w-100 h-screen items-center">
          <p className="font-bold text-3xl">Redirecting...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
