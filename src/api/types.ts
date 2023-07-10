export type Person = {
    id: number;
    name: string;
    age: string;
    image: string;
    address: string;
  };
  
  export type IGenericResponse = {
    status: string;
    message: string;
  };
  
  export type IPersonResponse = {
    status: string;
    person: Person;
  };
  
  export type IPersonsResponse = {
    status: string;
    results: number;
    persons: Person[];
  };