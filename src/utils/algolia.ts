import { UserInterface } from "@src/modules/users/interfaces.users";
import Search from "algoliasearch";

const client = Search(process.env.ALGOLIA_APP || "", process.env.ALGOLIA_SK || "");

class AlgoliaManager {
    public static updateArtist(data: { objectId: string, payload: UserInterface }) {
        const index = client.initIndex('artists_' + process.env.ALGOLIA_ENV);
        index.saveObject({ objectID: data.objectId, ...data.payload }).wait()
    }
}

export default AlgoliaManager
