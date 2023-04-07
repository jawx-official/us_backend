import { GoogleProfile, GoogleReturn } from '@modules/auth/interfaces.auth';
import { BadInputFormatException } from '@src/exceptions';
import fetch from 'cross-fetch';

type Types = "string" | "number" | "boolean" | "object";
function asA(data: unknown): GoogleReturn {
    const keyValidators: Record<keyof GoogleReturn, Types> = {
        emailAddresses: "object",
        photos: "object",
        names: "object",
        phoneNumbers: "object"
    }
    if (typeof data === 'object' && data !== null) {
        let maybeA = data as GoogleReturn
        for (const key of Object.keys(keyValidators) as Array<keyof GoogleReturn>) {
            if (typeof maybeA[key] !== keyValidators[key]) {
                throw new Error('data is not an A');
            }
        }
        return maybeA;
    }
    throw new Error('data is not an A');

}

export const authGoogle = async function (
    access_token: string
): Promise<GoogleProfile> {
    try {
        let url =
            'https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names,photos,locations,phoneNumbers';
        const response = await fetch(url, {
            method: "get",
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (!data) {
            throw new Error("Unable to login")
        }
        const me: GoogleReturn = asA(data)
        if (!me) {
            throw new Error("data is undefined")
        }

        const userGoogleEmail = me.emailAddresses[0]?.value || ""
        const userAvatar = me.photos[0]?.url || ""
        const displayName = me.names[0]?.displayName || ""
        const phone = me.phoneNumbers[0]?.value || ""
        return {
            channel: 'google',
            email: userGoogleEmail,
            avatar: userAvatar,
            name: displayName,
            phoneNumber: phone,
            accessToken: access_token,

        }
    } catch (error) {
        throw new BadInputFormatException(
            'The generated authorization code can only be used once. Regenerate another authorization code. '
        )
    }
}

