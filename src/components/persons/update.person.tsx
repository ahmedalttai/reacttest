import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Person } from "../../api/types";
import { updatePersonFn } from "../../api/personApi";

type IUpdatePersonProps = {
  person: Person;
  setOpenPersonModal: (open: boolean) => void;
};

const updatePersonSchema = object({
  name: string().min(1, "Name is required"),
  address: string().min(1, "Address is required"),
  age: string().min(1, "Age is required"),
  image: string().min(1, "Image is required"),
});

export type UpdatePersonInput = TypeOf<typeof updatePersonSchema>;

const UpdatePerson: FC<IUpdatePersonProps> = ({ person, setOpenPersonModal }) => {
  const methods = useForm<UpdatePersonInput>({
    resolver: zodResolver(updatePersonSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (person) {
      methods.reset(person);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryClient = useQueryClient();
  const { mutate: updatePerson } = useMutation({
    mutationFn: ({ personId, person }: { personId: number; person: UpdatePersonInput }) =>
      updatePersonFn(personId, person),
    onSuccess(data) {
      queryClient.invalidateQueries(["getPersons"]);
      setOpenPersonModal(false);
      toast("Person updated successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error: any) {
      setOpenPersonModal(false);
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
    },
  });

  const onSubmitHandler: SubmitHandler<UpdatePersonInput> = async (data) => {
    updatePerson({ personId: person.id, person: data });
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">Update Person</h2>
        <div
          onClick={() => setOpenPersonModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>{" "}
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Name
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors["name"] && "border-red-500"}`
            )}
            {...methods.register("name")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2 invisible`,
              `${errors["name"] && "visible"}`
            )}
          >
            {errors["name"]?.message as string}
          </p>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Address
          </label>
          <textarea
            className={twMerge(
              `appearance-none border rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors.address ? "border-red-500" : "border-gray-400"}`
            )}
            rows={6}
            {...register("address")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2`,
              `${errors.address ? "visible" : "invisible"}`
            )}
          >
            {errors.address && errors.address.message}
          </p>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Age
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors["age"] && "border-red-500"}`
            )}
            {...methods.register("age")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2 invisible`,
              `${errors["age"] && "visible"}`
            )}
          >
            {errors["age"]?.message as string}
          </p>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Image
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors["image"] && "border-red-500"}`
            )}
            {...methods.register("image")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2 invisible`,
              `${errors["image"] && "visible"}`
            )}
          >
            {errors["image"]?.message as string}
          </p>
        </div>
        <LoadingButton loading={false}>Update Person</LoadingButton>
      </form>
    </section>
  );
};

export default UpdatePerson;
