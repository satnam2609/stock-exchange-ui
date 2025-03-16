import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/nav/Header";
import Provider from "./Provider";
import { Divider } from "antd";
 
import { Bounce, ToastContainer } from "react-toastify";
export const metadata: Metadata = {
  title: "Compound",
  description: "This is a low latency stock exchange platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="flex flex-col items-center px-36 py-5">
            <Header />
            <Divider
              style={{
                borderColor: "#313030",
                width: "10px",
              }}
            />
             
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
              />
              {children}
            
          </div>
        </Provider>
      </body>
    </html>
  );
}
