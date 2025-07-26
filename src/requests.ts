import { MESSAGE_EVENT, type user } from "./types";

const { VITE_HOMESERVER, VITE_ROOM_ID, VITE_REGISTRATION_TOKEN } = import.meta.env;

const roomId = VITE_ROOM_ID;

export const getEvents = async (user: user) => {
    const url = `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${roomId}/messages?limit=10000&dir=f`

    console.log(url)

    const eventsResponse = await fetch(
        url,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        }
    );
    const events = await eventsResponse.json();
    return events;
};

export const postLogin = async (username: string, password: string) => {
    const loginResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/login`, {
        method: "POST",
        body: JSON.stringify({
            type: "m.login.password",
            identifier: {
                type: "m.id.user",
                user: username,
            },
            password: password,
        }),
    });
    const loginResult = await loginResponse.json();
    return loginResult;
};

export const postMessage = async (message: string, token: string) => {
    const postResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/rooms/${roomId}/send/${MESSAGE_EVENT}`, {
        method: "POST",
        body: JSON.stringify({
            body: message,
            msgtype: "m.text"
        }),
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const postResult = await postResponse.json();
    return postResult;
};

export const redactEvent = async (eventId: string, token: string, reason = "deleted by user") => {
    const redactResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${roomId}/redact/${eventId}/${Math.random()}`,
        {
            method: "PUT",
            body: JSON.stringify({
                reason,
            }),
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const redactResult = await redactResponse.json();
    return redactResult;
};

export const getUsernameAvailable = async (username: string) => {
    const availableResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/register/available?username=${username}`
    );

    const availableResult = await availableResponse.json();
    return availableResult;
};

export const postRegister = async (username: string, password: string) => {
    const sessionResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/register?kind=user`, {
        method: "POST",
        body: JSON.stringify({}),
    });
    const sessionResult = await sessionResponse.json();

    await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/register?kind=user`, {
        method: "POST",
        body: JSON.stringify({
            auth: {
                type: "m.login.registration_token",
                token: VITE_REGISTRATION_TOKEN,
                session: sessionResult.session,
            },
        }),
    });

    const dummyResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/register?kind=user`, {
        method: "POST",
        body: JSON.stringify({
            device_id: "web-client" + Math.random(),
            initial_device_display_name: "Booking website",
            password: password,
            username: username,
            auth: {
                type: "m.login.dummy",
                session: sessionResult.session,
            },
        }),
    });
    const dummyResult = await dummyResponse.json();
    return dummyResult;
};

export const joinRoom = async (access_token: string) => {
    await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/join/${roomId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export const postImage = async (fileName: string, image: ArrayBuffer, access_token: string) => {
    const fileExtension = fileName.split(".")[1];

    return fetch(`${VITE_HOMESERVER}/_matrix/media/v3/upload?filename=${fileName}`, {
        method: "POST",
        body: image,
        headers: {
            "Content-Type": `image/${fileExtension}`,
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export const getImage = async (access_token: string, mxc: string) => {
    return fetch(`${VITE_HOMESERVER}/_matrix/client/v1/media/download/${mxc}`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};
