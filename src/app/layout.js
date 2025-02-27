import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Root layout content */}
        {children}
      </body>
    </html>
  );
}