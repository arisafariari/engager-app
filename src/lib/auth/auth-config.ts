// src/lib/auth/auth-config.ts

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { InitiateAuthCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

if (!process.env.NEXT_PUBLIC_AWS_REGION || 
    !process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 
    !process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID) {
  throw new Error("Missing required AWS Cognito configuration");
}

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const response = await cognitoClient.send(
            new InitiateAuthCommand({
              AuthFlow: "USER_PASSWORD_AUTH",
              ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
              AuthParameters: {
                USERNAME: credentials.email,
                PASSWORD: credentials.password,
              },
            })
          );

          if (!response.AuthenticationResult?.AccessToken) {
            throw new Error("Invalid credentials");
          }

          return {
            id: credentials.email,
            email: credentials.email,
            name: credentials.email,
            accessToken: response.AuthenticationResult.AccessToken,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        // @ts-ignore
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
};