"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/UserAuthContent";
import PulseLoader from "react-spinners/PulseLoader";

export default function CheckLogin(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await fetch(
            "http://localhost:8000/api/v1/users/userAuth",
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
              setLoading(false);
            }
          } else {
            setIsAuthenticated(false);
            setLoading(false);
          }
        } catch (error) {
          setIsAuthenticated(false);
          console.error("Error checking authentication:", error);
          setLoading(false);
        }
      };

      if (auth?.token) {
        checkAuth();
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    }, [auth?.token, router]);

    // Show loading spinner while checking authentication
    if (loading) {
      return (
        <div className="flex justify-center w-100 h-screen items-center gap-4">
          <p className="font-bold text-3xl">Checking Authentication</p>
          <PulseLoader />
        </div>
      );
    }
    if (isAuthenticated) {
      router.push("/");

      return (
        <div className="flex justify-center w-100 h-screen items-center">
          <p className="font-bold text-3xl">Redirecting...</p>
        </div>
      );
    } else {
      return <WrappedComponent {...props} />;
    }
  };
}
