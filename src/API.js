import { TMDB_BASE_URL, TRAKT_BASE_URL } from './constants'
import { TMDB_API_KEY, TRAKT_CLIENT_ID, TRAKT_CLIENT_SECRET } from './credentials'

export async function getDeviceCode () {
  const headers = {
    'Content-Type': 'application/json'
  }
  const jsonData = { client_id: TRAKT_CLIENT_ID }
  try {
    const response = await fetch(
      `${TRAKT_BASE_URL}/oauth/device/code`, {
        headers,
        method: 'POST',
        body: JSON.stringify(jsonData)
      })
    if (!response.ok) {
      console.error('Error in getting device code')
    }
    const data = await response.json()
    console.debug(`Go to ${data.verification_url} and insert ${data.user_code}`)
    return {
      verification_url: data.verification_url,
      user_code: data.user_code,
      device_code: data.device_code,
      interval: data.interval,
      expires_in: data.expires_in
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function accessTokenFromDeviceCode (deviceCode) {
  const headers = {
    'Content-Type': 'application/json'
  }
  const jsonData = {
    code: deviceCode,
    client_id: TRAKT_CLIENT_ID,
    client_secret: TRAKT_CLIENT_SECRET
  }
  try {
    const response = await fetch(
      `${TRAKT_BASE_URL}/oauth/device/token`, {
        headers,
        method: 'POST',
        body: JSON.stringify(jsonData)
      })
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expiration_date: data.created_at + data.expires_in
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function accessTokenFromRefreshToken (refreshToken) {
  const headers = {
    'Content-Type': 'application/json'
  }
  const jsonData = {
    refresh_token: refreshToken,
    client_id: TRAKT_CLIENT_ID,
    client_secret: TRAKT_CLIENT_SECRET,
    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    grant_type: 'refresh_token'
  }
  try {
    const response = await fetch(
      `${TRAKT_BASE_URL}/oauth/token`, {
        headers,
        method: 'POST',
        body: JSON.stringify(jsonData)
      })
    if (!response.ok) {
      console.error('Error in getting access token')
    }
    const data = await response.json()
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expiration_date: data.created_at + data.expires_in
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

function getTraktAuthHeaders (accessToken, clientId) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'trakt-api-version': '2',
    'trakt-api-key': clientId
  }
}

export async function getWatched (type, accessToken) {
  try {
    const response = await fetch(
      `${TRAKT_BASE_URL}/sync/watched/${type}`, {
        headers: getTraktAuthHeaders(accessToken, TRAKT_CLIENT_ID),
        method: 'GET'
      })
    if (!response.ok) {
      console.error('Error in getting watched list')
    }
    const data = await response.json()
    const dataToRet = data.map(media => [
      media['movie' in media ? 'movie' : 'show'].title,
      media['movie' in media ? 'movie' : 'show'].ids.tmdb
    ])
    return dataToRet
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function getRecommendations (type, id) {
  const headers = {
    'Content-Type': 'application/json'
  }
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY
  })
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}/recommendations?${params}`, {
        headers,
        method: 'GET'
      })
    if (!response.ok) {
      console.error('Error in getting recommendations list')
    }
    const data = await response.json()
    return data.results
  } catch (error) {
    console.error('Error:', error)
  }
}
