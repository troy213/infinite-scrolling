import { useState, useEffect } from 'react'
import axios from 'axios'

const useBookSearch = (query, pageNumber) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setData([])
  }, [query])

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)

    let cancel
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)), // to prevent/cancel axios request if there was another request while request
    })
      .then((res) => {
        setData((prevData) => {
          // new Set used to remove a duplicate set of value
          return [
            ...new Set([...prevData, ...res.data.docs.map((d) => d.title)]),
          ]
          // default:
          // return [...prevData, res.data.docs]
        })
        setHasMore(res.data.docs.length > 0)
        setIsLoading(false)
      })
      .catch((err) => {
        if (axios.isCancel(err)) return
        setIsError(true)
      })
    return () => cancel()
  }, [query, pageNumber])
  return { isLoading, isError, data, hasMore }
}

export default useBookSearch
