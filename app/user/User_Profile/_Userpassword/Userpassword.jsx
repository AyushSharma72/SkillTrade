"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../../_context/UserAuthContent";
import { UpdatePassword } from "./fetchfunction/UpdatePassword";
import { Toaster, toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const UserPassword = () => {
  const [auth] = useAuth();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    if (!password.trim() || !newPassword.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (auth?.user?._id) {
      setLoading(true);
      try {
        const response = await UpdatePassword(auth?.user?._id, {
          oldpassword: password,
          newpass: newPassword,
        });

        if (response.success) {
          toast.success(response.message);
          setPassword("");
          setNewPassword("");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("An error occurred while updating the password");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <Card className="w-full max-w-md shadow-lg p-6 bg-white rounded-2xl border ">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Old Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your old password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </div>
          <Button
            className="w-full mt-2"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Reset Password"
            )}
          </Button>
          <div className="text-center mt-2">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPassword;
