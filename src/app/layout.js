import "./globals.css";

export const metadata = {
  title: "Campus Care",
  description: "Your thoughts count",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
