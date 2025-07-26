import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { getEvents } from "./requests.ts";
import type { matrixEvent, user } from "./types.ts";
import UserHeader from "./UserHeader.tsx";

function Main() {
    const [events, setEvents] = useState<matrixEvent[]>([]);
    const [user, setUser] = useState<user>();

    function loadUser() {
        const loginDetails = localStorage.getItem("rethinkingchat.login.details");
        if (loginDetails) {
            setUser(JSON.parse(loginDetails));
        }
    }

    async function loadEvents() {
        if (user) {
            const eventsResult = await getEvents(user);
            console.log(eventsResult);
            setEvents(eventsResult.chunk);
        }
    }

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        loadEvents();
    }, [user]);

    return (
        <StrictMode>
            <h1 id="title">Rethinking Chat Chat</h1>
            <UserHeader user={user} setUser={setUser} />
            <App user={user} events={events} loadEvents={loadEvents} />
        </StrictMode>
    );
}

createRoot(document.getElementById("root")!).render(<Main />);
