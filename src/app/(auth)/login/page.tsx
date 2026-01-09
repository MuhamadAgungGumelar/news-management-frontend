"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import FormInput from "@/components/forms/FormInput";
import { loginFormSchema, LoginFormValues } from "@/lib/utils/validators";
import { authApi } from "@/lib/api/auth";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const REMEMBER_EMAIL_KEY = "remembered_email";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, data.email);
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      // Call real login API
      const response = await authApi.login(data);
      const { accessToken, admin } = response.data;

      // Save auth to store
      setAuth(admin, accessToken);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: unknown) {
      let message = "Login failed";

      // Handle API error response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-sm text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          register={register as never}
          error={errors.email}
        />

        <FormInput
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          required
          register={register as never}
          error={errors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <MdVisibilityOff className="w-5 h-5" />
              ) : (
                <MdVisibility className="w-5 h-5" />
              )}
            </button>
          }
        />

        {/* Remember Me Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
          >
            Remember my email
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <LoadingSpinner size="sm" />}
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
