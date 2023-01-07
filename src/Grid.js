import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import BounceLoader from 'react-spinners/BounceLoader'
import { accessTokenFromDeviceCode, accessTokenFromRefreshToken, getDeviceCode, getRecommendations, getWatched } from './API'
import './App.css'
import { TMDB_BASE_URL } from './constants'
import { TMDB_API_KEY } from './credentials'
import Card from './ExpandableCard'
import { useLocalStorage } from './utils'

function Grid (props) {
  const imageSize = 'w185'

  // Fetches results
  const [imageBaseUrl, setImageBaseUrl] = useState('')
  const [deviceCodeResp, setDeviceCodeResp] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accessTokenResp, setAccessTokenResp] = useLocalStorage('accessToken', null)
  const [accessTokenFresh, setAccessTokenFresh] = useState(null)
  const [watched, setWatched] = useState(null)
  const [recommendedArr, setRecommendedArr] = useState([])

  useEffect(() => {
    async function getConfiguration () {
      const headers = {
        'Content-Type': 'application/json'
      }
      const params = new URLSearchParams({
        api_key: TMDB_API_KEY
      })
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/configuration?${params}`, {
            headers,
            method: 'GET'
          })
        if (response.ok) {
          const data = await response.json()
          setImageBaseUrl(data.images.base_url)
          console.assert(data.images.poster_sizes.includes(imageSize))
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
    getConfiguration()
  }, [])

  useEffect(() => {
    if (accessTokenResp !== null) {
      return
    }

    getDeviceCode()
      .then((toSave) => {
        setDeviceCodeResp(toSave)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (deviceCodeResp === null) {
      return
    }

    setIsLoading(false)
    async function retry () {
      let resp = null
      let elapsed = 0
      while (elapsed <= deviceCodeResp.expires_in && resp === null) {
        resp = await accessTokenFromDeviceCode(deviceCodeResp.device_code)
        await new Promise(resolve => setTimeout(resolve, deviceCodeResp.interval * 1000))
        elapsed += deviceCodeResp.interval
      }
      if (resp !== null) {
        setAccessTokenResp(resp)
        setAccessTokenFresh(true)
      } else {
        console.error("Can't get accessToken")
      }
    }
    retry()
  }, [deviceCodeResp])

  useEffect(() => {
    if (accessTokenResp === null || accessTokenFresh) {
      return
    }
    const secondsSinceEpoch = Math.round(Date.now() / 1000)
    if (secondsSinceEpoch < accessTokenResp.expiration_date) {
      // No need to be refreshed
      setAccessTokenFresh(true)
      return
    }
    console.debug('Refreshing access token')
    setIsLoading(true)
    accessTokenFromRefreshToken(accessTokenResp.refresh_token)
      .then((toSave) => {
        setAccessTokenResp(toSave)
        setAccessTokenFresh(true)
        console.debug('access token refreshed')
      })
  }, [accessTokenResp])

  useEffect(() => {
    if (props.type === null || accessTokenResp === null || !accessTokenFresh) {
      return
    }

    setIsLoading(true)
    getWatched(props.type, accessTokenResp.access_token)
      .then((toSave) => {
        setWatched(toSave)
      })
  }, [accessTokenResp, props.type, accessTokenFresh])

  useEffect(() => {
    if (watched === null) {
      return
    }

    (async () => {
      const watchedIds = watched.map(el => el[1])
      const type = props.type === 'movies' ? 'movie' : 'tv'
      const requests = watchedIds.map((id) => getRecommendations(type, id)) // Fetch in parallel
      const recommended = await Promise.all(requests)
      const flatRecommended = recommended.flat()
      const recommendedUnwatched = flatRecommended.filter(el => !(watchedIds.includes(el.id)))
      const recommendedScoreboard = recommendedUnwatched.reduce((tot, curr) => {
        if (!(curr.id in tot)) {
          tot[curr.id] = {
            title: props.type === 'movies' ? curr.title : curr.name,
            poster: curr.poster_path,
            backdrop: curr.backdrop_path,
            overview: curr.overview,
            points: 0
          }
        }
        tot[curr.id].points++
        return tot
      }, {})
      const nextRecommendedArr = Object.values(recommendedScoreboard)
      nextRecommendedArr.sort((first, second) => second.points - first.points) // Order in descending order using the points
      setRecommendedArr([...nextRecommendedArr])
      setIsLoading(false)
    })()
  }, [watched])

  return (
    <>
      {
        isLoading
          ? <div className='m-auto'>
              <BounceLoader color="#36d7b7" />
            </div>
          : accessTokenResp === null
            ? <div className='m-auto'>
                Go to <br/>
                <a href={deviceCodeResp.verification_url} target='_blank' rel='noreferrer'>{deviceCodeResp.verification_url}</a><br/>
                and insert<br/>
                <code>{deviceCodeResp.user_code}</code>
              </div>
            : <div className='justify-center gap-y-8 gap-x-4 my-9 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-5/6 lg:w-3/4 items-start'>
              {
                recommendedArr.map((el, idx) => {
                  return <Card
                    key={`card-${idx}`}
                    image={`${imageBaseUrl}${imageSize}${el.backdrop}`}
                    title={el.title} overview={el.overview}
                    width={imageSize.replace('w', '')}
                  />
                })
              }
            </div>
      }
    </>
  )
}

Grid.propTypes = {
  type: PropTypes.string
}

export default Grid
