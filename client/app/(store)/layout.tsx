import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
