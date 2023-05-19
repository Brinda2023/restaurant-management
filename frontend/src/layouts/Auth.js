import React from "react";

// components

export default function Auth({ children }) {
  return (
    <>
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-[#1e293b] bg-repeat-round bg-cover bg-[url('../assets/register_bg_2.png')]"
          >
          </div>
          {children}
        </section>
      </main>
    </>
  );
}
