import { LoginDTO, RegisterDTO, AuthResponse} from "./dto";
import { apiPrivate, apiPublic } from "../api";

const BASE_ROUTE = "/auth/";

export const login = async (loginDto: LoginDTO) => {
  const { data } = await apiPublic.post<AuthResponse>(
    BASE_ROUTE + "login",
    loginDto,
  );
  return data;
};

export const register = async (registerDto: RegisterDTO) => {
  const { data } = await apiPublic.post<AuthResponse>(
    BASE_ROUTE + "register",
    registerDto,
  );
  return data;
};

export const refresh = async () => {
  const { data } = await apiPrivate.post<AuthResponse>(BASE_ROUTE + "refresh");
  return data;
};
