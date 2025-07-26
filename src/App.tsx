import { useState } from "react";
import "./App.css";
import type { matrixEvent, user } from "./types";
import Event from "./Event";
import { postMessage } from "./requests";

function App({ user, events }: { user: user | undefined; events: matrixEvent[] }) {
    const [newMessage, setNewMessage] = useState("");

    async function sendMessage() {
        if (user && newMessage) {
            await postMessage(newMessage, user.access_token);
        }
    }

    return (
        <>
            <div id="events-container">
                {events && events.length > 0 ? (
                    events.map((event) => <Event event={event} key={event.event_id} />)
                ) : (
                    <p>Loading events</p>
                )}
            </div>
            {user && (
                <div id="send-container">
                    <input
                        id="message-input"
                        type="text"
                        placeholder="New message"
                        value={newMessage}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                        onChange={(e) => setNewMessage(e.target.value)}
                    ></input>
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}
        </>
    );
}

export default App;
