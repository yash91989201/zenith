import React from "react";

type Props = {
  children: React.ReactNode;
};

const BlurPage = ({ children }: Props) => {
  return (
    <div
      className="botton-0 absolute left-0 right-0 top-0 z-10 mx-auto  h-screen overflow-auto bg-muted/60 p-4 pt-24 backdrop-blur-[35px] dark:bg-muted/40 dark:shadow-2xl dark:shadow-black"
      id="blur-page"
    >
      {children}
    </div>
  );
};

export default BlurPage;
