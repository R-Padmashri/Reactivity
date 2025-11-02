"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function LoginForm(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const router = useRouter();
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    async function handleLogin(e){
        e?.preventDefault();

        const res = await fetch(`${API}/api/login`, {
            method: "POST",
            headers:{ "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        setMsg(data.message);

        if (res.ok){
            router.push(`/game?user=${username}`);
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
            <p>{msg}</p>
        </form>
    );
}
