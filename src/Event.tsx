import type { matrixEvent } from "./types";

function Event({ event }: { event: matrixEvent }) {
    if (event.type === "m.room.message")
        return (
            <div className="message-container">
                <p>
                    <span className="sender">{event.sender}</span> {event.content.body}
                </p>
            </div>
        );
    else return null;
}

export default Event;
