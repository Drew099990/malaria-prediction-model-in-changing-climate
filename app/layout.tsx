import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Logged from "./components/logged";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studipal",
  description: "Is a platform dedicated at aiding students ,pupils,lecturers or any one study or revise by proving all the necessary tool you will need to be able to effiectly do so all in one place ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
{        <header className="bg-white  animate-f1 shadow-xl shadow-gray-200/40 opacity-80  fixed w-full flex border border-blue-700/40 z-1000 ring-1 ring-black/10 justify-between text-black/90 items-center">
          <Link href="/" className="flex mx-4 shadow-2xs shadow-blue-100  z-40 opacity-100 text-black/90 text-2xl border rounded-3xl border-blue-300/70 animate- p-3 font-serif font-extrabold"><h1 className="text-blue-500/90">Malaria</h1><h1>Sphere</h1></Link>
       <div className="p-5 max-md:gap-1 max-md:hidden flex min-md:gap-5 text-black/70 z-1 opacity-80">
            <Link href="/tips" className="border-2 max-md:scale-70 hover:bg-blue-200/40  border-blue-200 ring-1 ring-black/40 p-1 rounded-2xl  duration-300 hover:scale-105">Malaria-Tips</Link>
            <Link   href="/forcast" className="border-2 duration-300 max-md:scale-70 hover:bg-blue-200/40 z-5 border-blue-200 ring-1 ring-black/40 p-1 rounded-2xl hover:scale-105">Forcast</Link>
            <Link  href="/checker" className="border-2 duration-300 max-md:scale-70 hover:bg-blue-200/40 border-blue-200 ring-1 ring-black/40 p-1 rounded-2xl hover:scale-105">Symptom-Checker</Link>
            </div>
        <Logged></Logged>
     
            <h1 className="font-serif opacity-70 px-10 min-md:hidden">only available on desktop</h1>
       
     
        
        </header>}
{children}
        <footer  className="flex duration-300 w-full fixed opacity-70 justify-center opacity-80 items-center  pt-30 z-90">
<Link href="https://sleepypanda.vercel.app" className="bottom-70 z-500 animate-bounce max-md:hidden max-sm:visible duration-500 hover:font-sans hover:scale-105 opacity-70 hover:opacity-100">©2025 {new Date().getFullYear() == 2025?"":"-2025"} Sleepy Panda All Rights Reserved</Link>

        </footer>
      </body>
    </html>
 
  );
}