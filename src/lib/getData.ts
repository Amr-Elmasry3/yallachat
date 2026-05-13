// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { redirect } from "next/navigation";

// => Libs & Utils
import { getToken } from "./tokenManager";
import { getBaseUrl } from "./getBaseUrl";

// => Libraries
import axios from "axios";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { GetDataFetchFunc } from "./types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface GetDataReturn<T> {
  success: boolean;
  data?: T;
  status: number;
}

export const getData = async <T>(
  config: GetDataFetchFunc,
): Promise<GetDataReturn<T> | undefined> => {
  // ******************* Inside Server Function *******************
  // => Functions
  const baseUrl = await getBaseUrl();

  // => Variables
  const token = await getToken({
    tokenName: "yalla_chat_user_token",
  });

  try {
    const response = await axios.get(`${baseUrl}/${config.url}`, {
      params: config.params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = response.data;

    if (result.success) {
      return { success: true, data: result.data, status: 200 };
    }
  } catch (error: unknown) {
    // Errors Mix Between Try Errors & Catch Errors In Api Route
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(error.message);

        // If No Valid Session Found
        if (error.response.status === 401) {
          redirect("/");
        }

        return {
          success: false,
          status: error.response.status,
        };
      }
    } else {
      return {
        success: false,
        status: 500,
      };
    }
  }
};
