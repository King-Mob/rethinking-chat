import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { getSync } from "./requests.ts";
import type { matrixEvent, user } from "./types.ts";
import UserHeader from "./UserHeader.tsx";

const { VITE_ROOM_ID } = import.meta.env;

function Main() {
    const [events, setEvents] = useState<matrixEvent[]>([]);
    const [user, setUser] = useState<user>();

    function loadUser() {
        const loginDetails = localStorage.getItem("rethinkingchat.login.details");
        if (loginDetails) {
            setUser(JSON.parse(loginDetails));
        }
    }

    async function sync(batch = null, oldEvents: matrixEvent[] = []) {
        if (user) {
            const result = await getSync(user.access_token, batch);
            let newEvents = oldEvents;
            if (result.rooms && result.rooms.join[VITE_ROOM_ID]) {
                const room = result.rooms.join[VITE_ROOM_ID];
                const timeline: matrixEvent[] = room.timeline.events;
                newEvents = oldEvents.concat(timeline);
                if (timeline) setEvents(newEvents);
            }
            sync(result.next_batch, newEvents);
        }
    }

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (user) sync();
    }, [user]);

    return (
        <StrictMode>
            <h1 id="title">Rethinking Chat Chat</h1>
            <UserHeader user={user} setUser={setUser} />
            <App user={user} events={events} />
        </StrictMode>
    );
}

createRoot(document.getElementById("root")!).render(<Main />);
