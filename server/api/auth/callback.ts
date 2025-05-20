import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'Authorization code is required'
    })
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    const { tokens } = await oauth2Client.getToken(code)
    
    // Store tokens in session or database as needed
    // For this example, we'll just return them
    return {
      success: true,
      tokens
    }
  } catch (error) {
    console.error('Error in Google OAuth callback:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to authenticate with Google'
    })
  }
}) 