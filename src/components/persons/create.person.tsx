import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { number, object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPersonFn } from "../../api/personApi";
import NProgress from "nprogress";

type ICreatePersonProps = {
  setOpenPersonModal: (open: boolean) => void;
};

const createPersonSchema = object({
  name: string().min(1, "Title is required"),
  address: string().min(1, "Content is required"),
  age: string().min(1, "age is required"),
  image: string().min(1, "image is required"),
});

export type CreatePersonInput = TypeOf<typeof createPersonSchema>;

const CreatePerson: FC<ICreatePersonProps> = ({ setOpenPersonModal }) => {
  const methods = useForm<CreatePersonInput>({
    resolver: zodResolver(createPersonSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();

  const { mutate: createPerson } = useMutation({
    mutationFn: (person: CreatePersonInput) => createPersonFn(person),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["getPersons"]);
      setOpenPersonModal(false);
      NProgress.done();
      toast("Person created successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error: any) {
      setOpenPersonModal(false);
      NProgress.done();
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

  const onSubmitHandler: SubmitHandler<CreatePersonInput> = async (data) => {
    createPerson(data);
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">Create Person</h2>
        <div
          onClick={() => setOpenPersonModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Name
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
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
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors.address && "border-red-500"}`
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
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
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
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
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
        <LoadingButton loading={false}>Create Person</LoadingButton>
      </form>
    </section>
  );
};

export default CreatePerson;
