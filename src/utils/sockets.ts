import * as Pusher from "pusher";

var pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID || "",
    key: process.env.PUSHER_KEY || "",
    secret: process.env.PUSHER_SECRET || "",
    cluster: process.env.PUSHER_CLUSTER || "",
});

class SocketEventManager {
    public static sendSocketMessage(data: { event: string, payload: any }) {
        pusher.trigger('ss-app', data.event, data.payload)
    }
}

export default SocketEventManager
