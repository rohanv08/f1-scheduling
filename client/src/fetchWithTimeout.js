 
export const fetchWithTimeout = (uri, options = {}, time) => {
    const controller = new AbortController()
    const config = { ...options, signal: controller.signal }
    // Set a timeout limit for the request using `setTimeout`. If the body
    // of this timeout is reached before the request is completed, it will
    // be cancelled.
    // const timeout = setTimeout(() => {
    //   controller.abort()
    // }, time)
    return fetch(uri, config)
      .then((response) => {
  
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
        console.log(response)
        return response
      })
      .catch((error) => {
        console.log("ERROR WITH FETCHTIMEOUT")
        console.log(error)
        if (error.name === 'AbortError') {
          console.log('aborting coz its been time')
          throw new Error(error.name)
        }
        throw new Error(error.message)
      })
  }