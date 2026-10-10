'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()

    // Use the type assertion for values from FormData
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/login?message=Could not authenticate user')
    }

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return redirect('/login?message=Could not authenticate user')
    }

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}

export async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/login')
}
