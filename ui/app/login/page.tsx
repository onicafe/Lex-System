import Link from 'next/link'
import { login, signup } from './actions'

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">

            {/* Absolute back button */}
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-white/50 hover:bg-white/5 hover:text-white flex items-center group text-sm transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
            </Link>

            <div className="w-full max-w-sm">
                <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-[#f4f4f5]">

                    <div className="text-center mb-8">
                        <div className="w-12 h-12 mx-auto mb-6 bg-[#4338ca] skew-x-12 transform -rotate-12 rounded-[2px]" />
                        <h1 className="text-2xl font-bold tracking-tight">System Access</h1>
                        <p className="text-white/50 text-sm mt-2">Lex B.L.A.S.T Unified Authentication</p>
                    </div>

                    <label className="text-md font-medium text-white/80" htmlFor="email">
                        Corporate Email
                    </label>
                    <input
                        className="rounded-md px-4 py-3 bg-[#111111] border border-white/10 text-white focus:outline-none focus:border-[#4338ca] transition-colors mb-4 placeholder:text-white/20"
                        name="email"
                        placeholder="you@lexsystem.com"
                        required
                    />

                    <label className="text-md font-medium text-white/80" htmlFor="password">
                        Secure Password
                    </label>
                    <input
                        className="rounded-md px-4 py-3 bg-[#111111] border border-white/10 text-white focus:outline-none focus:border-[#4338ca] transition-colors mb-6 placeholder:text-white/20"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                    />

                    <button
                        formAction={login}
                        className="bg-[#4338ca] hover:bg-[#4f46e5] text-white rounded-md px-4 py-3 font-semibold transition-colors mb-2 pointer"
                    >
                        Authenticate
                    </button>

                    <button
                        formAction={signup}
                        className="border border-white/10 hover:bg-white/5 text-white/70 rounded-md px-4 py-3 font-semibold transition-colors pointer"
                    >
                        Request Access
                    </button>

                    {searchParams?.message && (
                        <p className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-center text-sm rounded-md">
                            {searchParams.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
