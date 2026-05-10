export const metadata = {
  title: 'Report Decoded',
  description: 'AI Building Inspection Report Interpreter for Australian Property Buyers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
