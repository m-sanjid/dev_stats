import { Role, SubscriptionType } from "@prisma/client";

export interface User {
   image: string | null; 
   id: string; 
   role: Role; 
   name: string | null; 
   email: string |null; 
   password: string | null; 
   subscription: SubscriptionType; 
   githubUsername: string | null; 
   emailVerified: Date | null; 
   stripeCustomerId: string | null; 
   useWebhook: boolean; 
}