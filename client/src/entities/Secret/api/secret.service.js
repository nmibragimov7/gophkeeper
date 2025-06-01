import {fetcher} from "@/shared/lib/axios";

const api = {
  secrets: "/v1/secrets",
}

class SecretService {
  SECRETS = "secrets"
  secrets(meta) {
    return fetcher.get(api.secrets, {
      params: {
        meta
      }
    })
  }
  save(body) {
    return fetcher.post(api.secrets, body)
  }
  update({id, data}) {
    console.log(id, data)
    const formData = new FormData()
    formData.append("type", data.type)
    formData.append("meta", data.meta)
    if (data?.type === "card") {
      formData.append("data", data.data)
    }

    if (data?.type === "file" &&  data.data) {
      formData.append("data",  data.data)
    }

    return fetcher.put(api.secrets + "/" + id, formData)
  }
  remove(id) {
    return fetcher.delete(api.secrets + "/" + id)
  }
}

export default new SecretService();