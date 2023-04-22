
import { Properties } from '@src/modules/services';
import { Agenda, Job } from '@hokify/agenda'

const mongoConnectionString = process.env.EVENTS_MONGODB_URL || "mongodb://127.0.0.1/agenda";

class EventsManager {
    public agenda: Agenda;

    constructor() {
        this.agenda = new Agenda({ db: { address: mongoConnectionString } });
    }

    public async init() {
        // define agenda events here
        // this.agenda.define("disable old properties", async (job: Job) => {
        //     // job.attrs.data
        //     console.log("Executing disable old properties job");
        // });

        await this.agenda.start();

        // define the cron for all events here
        // await this.agenda.every("1 minute", "disable old properties");
    }
}

export default EventsManager;
