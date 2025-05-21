# LacQuer Admin Web

## Configuration

The API endpoint can be configured using environment variables. Create a `.env.local` file in the root of your project with the following content:

\`\`\`
NEXT_PUBLIC_API_URL=https://lacquer.up.railway.app
\`\`\`

## Security Considerations

- JWT tokens are stored in localStorage for simplicity, but for production applications, consider using more secure storage methods like HttpOnly cookies.
- All API requests that require authentication include the JWT token in the Authorization header as a Bearer token.
- The application validates the authentication state on each page load to ensure that protected routes remain secure.
