"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/apiLink";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    DOB: "",
    city: "",
    onBench: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = new FormData();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const payload = {
      ...formData,
      role: "consultant",
      DOJ: today,
    };

    Object.entries(payload).forEach(([key, value]) => {
      body.append(key, typeof value === "boolean" ? String(value) : value);
    });

    if (profilePicture) {
      body.append("profilePicture", profilePicture);
    }

    try {
      const res = await fetch(api + "users/register", {
        method: "POST",
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

      const data = await res.json();
      console.log("Registration successful", data);
      router.push("/signin");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5" />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Create an Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to sign up and get started.
            </p>
          </div>

          {/* Profile Picture Section moved here */}
          <div className="mb-5">
            <Label>Profile Picture</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-24 h-24 mt-2 rounded-full object-cover border"
              />
            )}
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>

            <div>
              <Label>Mobile Number</Label>
              <Input
                type="text"
                name="mobileNumber"
                placeholder="e.g. 9876543210"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.onBench}
                onChange={(val) => setFormData((prev) => ({ ...prev, onBench: val }))}
              />
              <Label className="!mb-0">Currently on bench</Label>
            </div>

            <Button type="submit" className="w-full" size="sm">
              Sign Up
            </Button>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
