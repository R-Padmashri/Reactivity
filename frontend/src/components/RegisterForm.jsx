"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const router = useRouter();
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    async function handleRegister(e) {
        e?.preventDefault();

        const res = await fetch(`${API}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        setMsg(data.message);

        if (res.ok) {
            router.push("/auth/login");
        }
    }

    return (
        <form onSubmit={handleRegister}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password (min 8 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
            <p>{msg}</p>
        </form>
    );
}
