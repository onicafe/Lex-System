'use server'

import { revalidatePath } from 'next/cache'
import { encryptPII } from '../../../lib/vault'

// B.L.A.S.T Core Rule: Server Actions must handle sensitive operations so secrets (like VAULT_KEY) don't leak.
export async function addSecureClient(formData: { fullName: string, cpf: string, rg: string, email: string }) {

    // 1. Intercept and encrypt PII before any database interaction
    const encryptedCpf = encryptPII(formData.cpf);
    const encryptedRg = formData.rg ? encryptPII(formData.rg) : null;

    // 2. Mock Database Insertion
    console.log(`[Lex Vault] Securely inserting client: ${formData.fullName}`);
    console.log(`[Lex Vault] Encrypted CPF: ${encryptedCpf}`);

    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Note: In reality we would call Supabase RPC or insert here.
    // e.g. await supabase.from('client_registry').insert({ name, encrypted_cpf: encryptedCpf })

    // 3. Revalidate the Client Registry layout to fetch new data
    revalidatePath('/dashboard/clients')

    return { success: true };
}
