import "react-toastify/dist/ReactToastify.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getPersonsFn } from "./api/personApi";
import PersonModal from "./components/person.modal";
import CreatePerson from "./components/persons/create.person";
import PersonItem from "./components/persons/person.component";
import NProgress from "nprogress";

function AppContent() {
  const [openPersonModal, setOpenPersonModal] = useState(false);

  const {
    data: persons,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getPersons"],
    queryFn: () => getPersonsFn(),
    staleTime: 5 * 1000,
    select: (data) => data,
    onSuccess() {
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

  useEffect(() => {
    if (isLoading || isFetching) {
      NProgress.start();
    }
  }, [isLoading, isFetching]);

  return (
    <div className="2xl:max-w-[90rem] max-w-[68rem] mx-auto">
      <div className="m-8 grid grid-cols-[repeat(auto-fill,_320px)] gap-7 grid-rows-[1fr]">
        <div className="p-4 min-h-[18rem] bg-white rounded-lg border border-gray-200 shadow-md flex flex-col items-center justify-center">
          <div
            onClick={() => setOpenPersonModal(true)}
            className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-ct-blue-600 rounded-full text-ct-blue-600 text-5xl cursor-pointer"
          >
            <i className="bx bx-plus"></i>
          </div>
          <h4
            onClick={() => setOpenPersonModal(true)}
            className="text-lg font-medium text-ct-blue-600 mt-5 cursor-pointer"
          >
            Add new person
          </h4>
        </div>
        {/* Person Items */}

        {persons?.map((person) => (
          <PersonItem key={person.id} person={person} />
        ))}

        {/* Create Person Modal */}
        <PersonModal
          openPersonModal={openPersonModal}
          setOpenPersonModal={setOpenPersonModal}
        >
          <CreatePerson setOpenPersonModal={setOpenPersonModal} />
        </PersonModal>
      </div>
    </div>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
