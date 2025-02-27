import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <nav className="flex justify-between p-4 bg-black shadow-lg">
          <Link href="/" className="text-xl font-bold">
          </Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
