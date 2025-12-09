
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// console.log(supabaseUrl)
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
// console.log(supabaseKey)

export const supabase = createClient(supabaseUrl, supabaseKey)



/**
 * Se déconnecter
 */
export const signOut = async () => supabase.auth.signOut();


/**
 * S'authentifier avec google
 */
export const signInWithGoogle = async () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: import.meta.env.VITE_SUPABASE_CALLBACK_URL,
    },
  })
}


/**
 * S'authentifier via formulaire
 */
export const signIn = async (email, password) => supabase.auth.signInWithPassword(
  {  
    email: email, 
    password: password,
  }
)


/**
 * S'enregistrer
 */
export const signUp = async (email, password, optionalData) => {
  
  const data = {
    role: 'user', // role utilisateur
    ...(optionalData || {}),
  };

  return supabase.auth.signUp(
    {
      email: email,
      password: password,
      options: {
        data,
      },
    }
  );
}


/**
 * Renvoyer l'eamil de confirmation à nouveau
 */
export const resendOTP = async (email) => supabase.auth.resend(
  {
    type: 'signup',
    email: email,
    options: {
        emailRedirectTo: import.meta.VITE_APP_URL
    }
  }
)