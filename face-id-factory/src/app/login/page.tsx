import { LoginForm } from "@/components/login-form";
import { Factory } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="container relative flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div
        className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <img
            src="/leoni-logo.png"
            alt="Leoni Logo"
            className="max-w-full max-h-full object-contain"
            data-ai-hint="industrial factory"
          />
          <div className="mt-4 text-center flex flex-col items-center">
            <div className="flex items-center justify-center text-lg font-medium mb-4 text-blue-700 dark:text-white">
              <Factory className="mr-2 h-6 w-6 text-blue-700 dark:text-white" />
              FaceID Factory Access
            </div>
            <blockquote className="space-y-2 text-blue-700 dark:text-white">
              <p className="text-lg">
                &ldquo;La sécurité et l'efficacité ne sont pas des options, ce sont des standards.&rdquo;
              </p>
              <footer className="text-sm">Leoni Group</footer>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
} 