import {fetcher} from "@/shared/lib/axios";

const api = {
  login: "/v1/login",
  register: "/v1/register",
}

class AuthService {
  login(body) {
    return fetcher.post(api.login, body)
  }
  register(body) {
    return fetcher.post(api.register, body)
  }
}

export default new AuthService();