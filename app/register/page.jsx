"use client";
import dynamic from "next/dynamic";
// Dynamically import the Tabs component with ssr: false
const Tabs = dynamic(() => import("@/components/ui/tabs"), { ssr: false });
const UserRegisterForm = dynamic(
  () => import("../_components/register/UserRegisterForm"),
  { ssr: false }
);
const WorkerRegisterForm = dynamic(
  () => import("../_components/register/WorkerRegisterForm"),
  { ssr: false }
);
import CheckLogin from "../_components/privateroutes/CheckLogin";

const Register = () => {
  return (
    <div className="flex justify-center sm:mt-0 mt-20">
      <Tabs defaultValue="user" className="lg:w-1/2 mt-4 sm:w-3/4 w-[90%]">
        <TabsList className="w-full justify-around bg-black">
          <TabsTrigger value="user" className="font-bold">
            Register As User
          </TabsTrigger>
          <TabsTrigger value="worker" className="font-bold">
            Register As Service Provider
          </TabsTrigger>
        </TabsList>

        {/* tab 1 */}

        <TabsContent value="user">
          <UserRegisterForm />
        </TabsContent>

        {/* tab 2 */}

        <TabsContent value="worker">
          <WorkerRegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheckLogin(Register);
