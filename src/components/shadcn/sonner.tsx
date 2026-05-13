"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        // Setup Every Color
        classNames: {
          // Success => Green
          success:
            "!bg-green-50 !text-green-900 !border-green-200 !border-l-4 !border-l-green-500",
          // Error => Red
          error:
            "!bg-red-50 !text-red-900 !border-red-200 !border-l-4 !border-l-red-500",
          // Warning => Orange
          warning:
            "!bg-amber-50 !text-amber-900 !border-amber-200 !border-l-4 !border-l-amber-500",
          // Info => Blue
          info: "!bg-blue-50 !text-blue-900 !border-blue-200 !border-l-4 !border-l-blue-500",
          // Loading => Gray
          loading:
            "!bg-gray-50 !text-gray-900 !border-gray-200 !border-l-4 !border-l-gray-500",

          // Gloable Settings
          toast: "group toast-group !shadow-lg !rounded-lg !font-cairo",
          title: "!font-semibold !text-sm",
        },
      }}
      // Another Settings
      position="top-center"
      expand={false}
      duration={5000}
      richColors={false} // Stop Default Colors (Important)
      {...props}
    />
  );
};

export { Toaster };
