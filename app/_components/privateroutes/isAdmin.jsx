"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const isAdmin = (WrappedComponent) => {
  return function RoleProtectedComponent(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      const checkAdminRole = () => {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
          try {
            const auth = JSON.parse(storedAuth);

            if (auth?.user?.role === 2) {
              setIsAdmin(true);
            } else {
              toast("error checking authentication")
              router.replace("/");
            }
          } catch (error) {
            console.error("Error parsing auth data:", error);
            router.replace("/");
          }
        } else {
          toast("please login")
          router.replace("/"); // Redirect if no auth data
        }
        setLoading(false);
      };

      checkAdminRole();
    }, [router]);

    // Show a loading state while checking authentication
    if (loading) {
      return (
        <div className="h-screen flex justify-center items-center text-2xl font-bold">
          Checking Authentication...
        </div>
      );
    }

    if (isAdmin) {
      return <WrappedComponent {...props} role={2} />;
    }

    // Prevent rendering anything else if the user is not an admin
    return null;
  };
};

export default isAdmin;
