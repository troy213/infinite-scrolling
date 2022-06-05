import React, { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'
import './App.css'

const App = () => {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const { isLoading, isError, data, hasMore } = useBookSearch(query, pageNumber)
  const observer = useRef()
  const lastDataElementRef = useCallback(
    (node) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore]
  )

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  return (
    <>
      <input type='text' onChange={handleChange} value={query} />
      {data.map((book, index) => {
        if (data.length === index + 1) {
          return (
            <div ref={lastDataElementRef} key={book} className='book'>
              {book}
            </div>
          )
        } else {
          return (
            <div key={book} className='book'>
              {book}
            </div>
          )
        }
      })}
      <div>{isLoading && 'Loading...'}</div>
      <div>{isError && 'Error'}</div>
    </>
  )
}

export default App
