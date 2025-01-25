import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/stores/cart";
import { Toaster } from "react-hot-toast";
import { OrderProvider } from "@/stores/orders";
import ScrollToTop from "@/components/ScrollToTop";
import Image from "next/image";
import { PathaoProvider } from "@/stores/pathao";
import { ProductsProvider } from "@/stores/products";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-auto`}
      >
        <SessionProvider>
          <CartProvider>
            <OrderProvider>
              <PathaoProvider>
                <ProductsProvider>
                  <Toaster />
                  <ScrollToTop />
                  <Navbar />
                  <div className="min-h-[calc(100vh-(60px+20px+40px+250px+10px))]">
                    {children}
                  </div>
                  <div className="relative">
                    <div className="w-full min-h-[200px] h-fit flex flex-col items-center bg-base-theme pt-5 text-white absolute top-0 left-0 right-0 border-t">
                      <div className="w-full md:w-2/3 flex mx-auto flex-wrap my-3 p-3">
                        <div className="w-full flex flex-col justify-start md:w-1/4 mb-3 md:mb-0">
                          <Image src={'/white_logo.png'} alt="Zilmil" height={100} width={120} className='h-[50px] mb-1' />
                          <b className="my-2">Got a question? Call us 9AM - 10PM</b>
                          <b className="my-2">01301871077</b>
                          <b className="my-2">Follow us</b>
                          <div className="flex">
                            <Image height={80} width={80} src="/facebook.png" alt="Facebook" className="w-[30px] h-[30px] me-2" />
                            <Image height={80} width={80} src="/instagram.png" alt="instagram" className="w-[30px] h-[30px] me-2" />
                            <Image height={80} width={80} src="/whatsapp.png" alt="whatsapp" className="w-[30px] h-[30px] me-2" />
                            <Image height={80} width={80} src="/youtube.png" alt="youtube" className="w-[30px] h-[30px] me-2" />
                          </div>
                        </div>
                        <div className="w-full flex flex-col justify-start md:w-1/4 mb-3 md:mb-0">
                          <div className="text-2xl text-white font-bold">Company</div>
                          <b className="my-2">Return Policy</b>
                          <b className="my-2">Privacy Policy</b>
                          <b className="my-2">Deliver an Policy</b>
                        </div>
                        <div className="w-full flex flex-col justify-start md:w-1/4 mb-3 md:mb-0">
                          <div className="text-2xl text-white font-bold">Support</div>
                          <b className="my-2">Contact us</b>
                          <b className="my-2">Shop</b>
                          <b className="my-2">Track your order</b>
                        </div>
                        <div className="w-full flex flex-col justify-start md:w-1/4 mb-3 md:mb-0">
                          <div>
                            Like us on facebook
                          </div>
                          <Image height={200} width={200} className="w-full h-[300px]" src="/fb_page.jpg" alt="Facebok" />
                        </div>
                      </div>
                      <div className="w-full h-[50px] bg-slate-50 p-5">
                        <div className="w-full md:w-2/3 flex items-center mx-auto flex-wrap flex-cop md:flex-row">
                          <span className="text-base-theme font-bold">
                            @Zilmil all right reserved
                          </span>
                          <div className="md:ms-auto flex-wrap hidden md:flex">
                            <span className="font-bold text-base-theme">We are using safe payments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ProductsProvider>
              </PathaoProvider>
            </OrderProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
