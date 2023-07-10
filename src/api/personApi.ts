import axios from "axios";
import { CreatePersonInput } from "../components/persons/create.person";
import { UpdatePersonInput } from "../components/persons/update.person";
import { Person, IPersonResponse, IPersonsResponse } from "./types";

const BASE_URL = "https://api.baserow.io/api/database/rows/table/179343/";


export const personsApi = axios.create({
  baseURL: BASE_URL,
 
  headers: {
    Authorization: "Token YpEXOuxETtXixlw1jyq4x4nm7gcizihT",
    "Content-Type": "application/json"
  }

});

// personsApi.defaults.headers.common["Content-Type"] = "application/json";
// personsApi.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
// personsApi.defaults.headers.common["X-Master-Key"] = "$2b$10$oGU.DAvXucMP66iBb6/1juqUbIWqHWFGnrRwexUCt5hlhXmQoQH2G";
// personsApi.defaults.headers.common["X-Access-Key"] = "$2b$10$HlBIjoh4X1SJwswV1Sk8EOQx7Ur9Vl0ZvWQjSJG.a293zHrMu366K";
export const createPersonFn = async (person: CreatePersonInput) => {
    console.log(person);
  const response = await personsApi.post<IPersonResponse>("?user_field_names=true", person);
  return response.data;
};

export const updatePersonFn = async (personId: number, person: UpdatePersonInput) => {
  const response = await personsApi.patch<IPersonResponse>(`${personId}/?user_field_names=true`, person);
  return response.data;
};

export const deletePersonFn = async (personId: number) => {
  return personsApi.delete<null>(`${personId}/`);
};

export const getSinglePersonFn = async (personId: string) => {
  const response = await personsApi.get<IPersonResponse>(`${personId}`);
  return response.data;
};

export const getPersonsFn = async (page = 1, limit = 10) => {
  const response = await personsApi.get<IPersonsResponse>(
    `?user_field_names=true`
  );
  console.log(response);
  return response.data.results;
};
