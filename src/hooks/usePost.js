import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'

export const fetchPost = (postId) =>
  axios.get(`/api/posts/${postId}`).then((res) => res.data)

export default function usePost(postId) {
  const queryClient = useQueryClient()
  return useQuery(['posts', postId], () => fetchPost(postId), {
    initialData: () => {
      return queryClient.getQueryData('posts')?.find((d) => d.id == postId)
    },
    initialStale: true,
  })
}
