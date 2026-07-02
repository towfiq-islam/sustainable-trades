import Echo from "laravel-echo";
import Pusher from "pusher-js";

if (typeof window !== "undefined") {
  (window as any).Pusher = Pusher;
}

const echo =
  typeof window !== "undefined"
    ? new Echo({
        broadcaster: "pusher",
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
        forceTLS: true,
        enabledTransports: ["ws", "wss"],
        authorizer: (channel: any) => {
          return {
            authorize: (
              socketId: string,
              callback: (error: Error | null, data: any) => void,
            ) => {
              fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/broadcasting/auth`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  body: JSON.stringify({
                    socket_id: socketId,
                    channel_name: channel.name,
                  }),
                },
              )
                .then(res => res.json())
                .then(data => callback(null, data))
                .catch(err => callback(err, null));
            },
          };
        },
      })
    : null;

export default echo;
