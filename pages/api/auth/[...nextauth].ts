import NextAuth from 'next-auth';
import {useSession} from 'next-auth/react';
import { MongoClient } from "mongodb"
import EmailProvider from "next-auth/providers/email"; 
import clientPromise from './lib/mongodb';
import dbConnect from './lib/connectdb';
import { MongoDBAdapter} from '@next-auth/mongodb-adapter';
import { compare } from "bcrypt";
import auth from "./lib/model/newsletter";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from 'next/dist/server/api-utils';

const uri = process.env.MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}


export default NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
              email: {
                label: "Email",
                type: "text",
              },
              password: {
                label: "Password",
                type: "password",
              },
            },
            async authorize(credentials) {
              await dbConnect();
      
              // Find user with the email
              const user = await auth.findOne({
                email: credentials?.email,
              });
      
              // Email Not found
              if (!user) {
                throw new Error("Email is not registered");
              }
      
              // Check hased password with DB hashed password
              const isPasswordCorrect = await compare(
                credentials!.password,
                user.hashedPassword
              );
      
              // Incorrect password
              if (!isPasswordCorrect) {
                throw new Error("Password is incorrect");
              }
      
              return user;
            },
          }),
    ],
    pages:{
        signIn: '/signin'
    },
    callbacks: {
        // jwt: async ({ token, user }) => {
        //     user && (token.user = user)
        //     return token;
        // },
       async redirect(){
          return 'http://panamia.club'
        }
    
    },
    session: {
        strategy: "jwt",
      },
    secret: "secret",
    jwt: {
        secret: "ksdkfsldferSEFSEFSEf"
    },

});