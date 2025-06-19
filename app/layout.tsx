// app/layout.tsx
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "تطبيق إدارة الأصول",
  description: "نظام إدارة الأصول والعهد",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}