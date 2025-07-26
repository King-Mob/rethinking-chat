export type matrixEvent = {
    type: string;
    event_id: string;
    content: any;
    sender: string;
};

export type user = {
    name: string;
    access_token: string;
};

export const MESSAGE_EVENT = "m.room.message";
