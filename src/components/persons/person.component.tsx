import React, { FC, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import PersonModal from "../person.modal";
import UpdatePerson from "./update.person";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NProgress from "nprogress";
import { Person } from "../../api/types";
import { deletePersonFn } from "../../api/personApi";

type PersonItemProps = {
  person: Person;
};

const PersonItem: FC<PersonItemProps> = ({ person }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openPersonModal, setOpenPersonModal] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById(`settings-dropdown-${person.id}`);

      if (dropdown && !dropdown.contains(target)) {
        setOpenSettings(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [person.id]);

  const queryClient = useQueryClient();
  const { mutate: deletePerson } = useMutation({
    mutationFn: (personId: number) => deletePersonFn(personId),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["getPersons"]);
      toast("Person deleted successfully", {
        type: "warning",
        position: "top-right",
      });
      NProgress.done();
    },
    onError(error: any) {
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
      NProgress.done();
    },
  });

  const onDeleteHandler = (personId: number) => {
    if (window.confirm("Are you sure")) {
      deletePerson(personId);
    }
  };
  return (
    <>
      <div className="max-w-sm bg-white rounded overflow-hidden shadow-lg">
      <img 
      className="w-full"
      src={person.image}
      alt="new"
      />
        <div className="details px-6 py-4">
          <h4 className="mb-2 pb-2 text-2xl font-semibold tracking-tight text-gray-900">
            {person.name.length > 40
              ? person.name.substring(0, 40) + "..."
              : person.name}
          </h4>
          <p className="mb-3 font-normal text-ct-dark-200">
            {person.address.length > 210
              ? person.address.substring(0, 210) + "..."
              : person.address}
          </p>

         
        </div>
        <div className="px-6 py-4">
        <div className="relative border-t border-slate-300 flex justify-between items-center">
          <span className="text-ct-dark-100 text-sm">
            {String(person.age)}
          </span>
          <div
            onClick={() => setOpenSettings(!openSettings)}
            className="text-ct-dark-100 text-lg cursor-pointer"
          >
            <i className="bx bx-dots-horizontal-rounded"></i>
          </div>
          <div
            id={`settings-dropdown-${person.id}`}
            className={twMerge(
              `absolute right-0 bottom-3 z-10 w-28 text-base list-none bg-white rounded divide-y divide-gray-100 shadow`,
              `${openSettings ? "block" : "hidden"}`
            )}
          >
            <ul className="py-1" aria-labelledby="dropdownButton">
              <li
                onClick={() => {
                  setOpenSettings(false);
                  setOpenPersonModal(true);
                }}
                className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <i className="bx bx-pencil"></i> Edit
              </li>
              <li
                onClick={() => {
                  setOpenSettings(false);
                  onDeleteHandler(person.id);
                }}
                className="py-2 px-4 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
              >
                <i className="bx bx-trash"></i> Delete
              </li>
            </ul>
          </div>
        </div>
        </div>
        
      </div>
      <PersonModal
        openPersonModal={openPersonModal}
        setOpenPersonModal={setOpenPersonModal}
      >
        <UpdatePerson person={person} setOpenPersonModal={setOpenPersonModal} />
      </PersonModal>
    </>
  );
};

export default PersonItem;
