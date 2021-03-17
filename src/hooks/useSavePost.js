import axios from 'axios'
import { queryCache, useMutation } from 'react-query'

export default function useSavePost() {
  return useMutation(
    (values) =>
      axios.patch(`/api/posts/${values.id}`, values).then((res) => res.data),
    {
      onSuccess: (data, values) => {
        queryCache.invalidateQueries(['posts', data.id])
      },
    }
  )
}
