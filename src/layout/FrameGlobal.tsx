import { useTheme } from "@/context/ThemeContext";
import useSocketNotification from "@/hooks/useSocketNotification";
import React, { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";

type Props = {} & PropsWithChildren;
function FrameGlobal({ children }: Props) {
  const themeContext = useTheme();
  useSocketNotification();

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
        style={{
          zIndex: 999999,
        }}
      />
    </>
  );
}

export default FrameGlobal;
