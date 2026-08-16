// Implicit flow via GIS initTokenClient.
// Directly retrieves access token client-side without backend/client secret.
const CLIENT_ID = '211566310938-vma007i338vd1utnrbd3t7203q98fk4c.apps.googleusercontent.com'
const SCOPE = 'https://www.googleapis.com/auth/generative-language.retriever'

let _token = null
let _tokenExpiry = 0
let _tokenClient = null

export function initAuth(onToken, onError) {
  const google = window.google
  if (!google || !google.accounts || !google.accounts.oauth2) {
    onError?.('Google Identity Services SDK is not loaded. Please verify your internet connection and refresh the page.')
    return
  }

  _tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPE,
    callback: (response) => {
      if (response.error) {
        onError?.(`OAuth error: ${response.error} — ${response.error_description ?? ''}`)
        return
      }

      _token = response.access_token
      _tokenExpiry = Date.now() + (response.expires_in - 60) * 1000
      onToken(_token)
    },
  })
}

export function requestAuth() {
  if (!_tokenClient) throw new Error('Call initAuth first.')
  _tokenClient.requestAccessToken()
}

export function getToken() {
  if (!_token || Date.now() >= _tokenExpiry) return null
  return _token
}

export function clearToken() {
  _token = null
  _tokenExpiry = 0
}
