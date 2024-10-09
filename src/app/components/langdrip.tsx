'use client'

import { useState } from 'react'
import { Octokit } from '@octokit/rest'
import Image from 'next/image'
import Footer from './footer'

const octokit = new Octokit()

interface LanguageData {
    [key: string]: number
}

interface UserData {
    languages: [string, number][]
    avatar_url: string
    name: string
    login: string
}

export default function LangDrip() {
    const [username, setUsername] = useState('')
    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchUserData = async () => {
        setLoading(true)
        try {
            const { data: user } = await octokit.users.getByUsername({ username })
            const { data: repos } = await octokit.repos.listForUser({ username })
            const languages: LanguageData = {}
            for (const repo of repos) {
                if (repo.language) {
                    languages[repo.language] = (languages[repo.language] || 0) + 1
                }
            }
            const sortedLanguages = Object.entries(languages)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
            setUserData({
                languages: sortedLanguages,
                avatar_url: user.avatar_url,
                name: user.name || user.login,
                login: user.login
            })
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-900 text-cyan-300 p-8 font-mono">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">LANGDRIP</h1>
                <div className="mb-8 flex justify-center">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter GitHub username"
                        className="bg-gray-800 text-cyan-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                        onClick={fetchUserData}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        {loading ? 'Loading...' : 'Fetch Data'}
                    </button>
                </div>
                {userData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <div className="flex items-center mb-6">
                                <Image
                                    src={userData.avatar_url}
                                    alt={`${userData.name}'s avatar`}
                                    width={64}
                                    height={64}
                                    className="rounded-full mr-4"
                                />
                                <div>
                                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                                    <p className="text-cyan-500">@{userData.login}</p>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Top Languages</h3>
                            <div className="space-y-2">
                                {userData.languages.map(([lang, count]) => (
                                    <div key={lang} className="flex items-center">
                                        <div className="w-32 truncate">{lang}</div>
                                        <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                                                style={{ width: `${(count / userData.languages[0][1]) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="w-12 text-right">{count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-center">
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                                <circle cx="100" cy="100" r="80" fill="none" stroke="#0ff" strokeWidth="2" />
                                <circle cx="100" cy="100" r="40" fill="#0ff" opacity="0.2" />
                                <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="#0ff" fontSize="12">
                                    {userData.languages[0][0]}
                                </text>
                                {userData.languages.slice(0, 5).map(([lang], index) => {
                                    const angle = (index / 5) * Math.PI * 2 - Math.PI / 2
                                    const x = 100 + Math.cos(angle) * 60
                                    const y = 100 + Math.sin(angle) * 60
                                    return (
                                        <g key={lang}>
                                            <circle cx={x} cy={y} r="5" fill="#f0f" />
                                            <text x={x} y={y + 15} textAnchor="middle" fill="#f0f" fontSize="8">
                                                {lang}
                                            </text>
                                        </g>
                                    )
                                })}
                            </svg>
                        </div>
                    </div>
                )}
                <Footer />
            </div>
        </div>
    )
}