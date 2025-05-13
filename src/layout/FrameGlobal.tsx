import { useTheme } from "@/context/ThemeContext";
import React, { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";

type Props = {} & PropsWithChildren;
function FrameGlobal({ children }: Props) {
  const themeContext = useTheme();

  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={themeContext.theme == 'dark' ? 'dark' : 'light'}
      />
    </>
  );
}

export default FrameGlobal;
