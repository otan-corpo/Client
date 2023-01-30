import {useCookies} from 'react-cookie'
import {useMutation, useQuery, useQueryClient} from "react-query";
import {http} from "../utils/helper";
import {useContext} from "react";
import {AuthenticationContext} from "../contexts/AuthenticationContext";

const useQuestions = () => {
  const [cookie, setCookie] = useCookies(['token'])
  const queryClient = useQueryClient()

  function create () {
    return useMutation(async (data: any) => {
      const response = await http.post('/questions/create', data, {
        method: 'POST',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': cookie.token
        }
      })

      return response.data
    }, { onSuccess: async (data) => {
      queryClient.setQueryData(['questions'], (oldData: any) => [data, ...oldData])
    }})
  }

  function fetchByUser () {
    const { user } = useContext(AuthenticationContext)
    return useQuery('questions_user', async () => {
      const response = await http.get(`/questions/user/${user?.email}`, {
        headers: {
          "Authorization": cookie.token
        }
      })
      console.log(response.data)
      return response.data
    }, { staleTime: Infinity })
  }

  function fetch () {
    return useQuery('questions', async () => {
      const response = await http.get('/questions', {
        headers: {
          "Authorization": cookie.token
        }
      })

      return response.data
    }, { staleTime: Infinity })
  }
  function destroy () {}

  return {
    create,
    fetchByUser,
    fetch,
    destroy
  }
}

export default useQuestions