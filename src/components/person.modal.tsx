import ReactDom from "react-dom";
import React, { FC } from "react";

type IPersonModal = {
  openPersonModal: boolean;
  setOpenPersonModal: (open: boolean) => void;
  children: React.ReactNode;
};

const PersonModal: FC<IPersonModal> = ({
  openPersonModal,
  setOpenPersonModal,
  children,
}) => {
  if (!openPersonModal) return null;
  return ReactDom.createPortal(
    <>
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,.5)] z-[1000]"
        onClick={() => setOpenPersonModal(false)}
      ></div>
      <div className="max-w-lg w-full rounded-md fixed top-0 xl:top-[10%] left-1/2 -translate-x-1/2 bg-white z-[1001] p-6">
        {children}
      </div>
    </>,
    document.getElementById("person-modal") as HTMLElement
  );
};

export default PersonModal;
