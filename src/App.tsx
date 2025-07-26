import { useState } from "react";
import "./App.css";
import type { matrixEvent, user } from "./types";
import Event from "./Event";
import { postMessage } from "./requests";

function App({ user, events, loadEvents }: { user: user | undefined; events: matrixEvent[]; loadEvents: () => void }) {
    const [newMessage, setNewMessage] = useState("");

    async function sendMessage() {
        if (user && newMessage) {
            await postMessage(newMessage, user.access_token);
            loadEvents();
        }
    }

    return (
        <>
            <div id="events-container">
                {events.map((event) => (
                    <Event event={event} />
                ))}
            </div>
            {user && (
                <div id="send-container">
                    <input
                        id="message-input"
                        type="text"
                        placeholder="new message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    ></input>
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}
        </>
    );
}

export default App;
