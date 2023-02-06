import { executeCronJobs } from "./cronjobs/index.cronjobs";
import { tellMeDirnameFromEmail } from "./helpers/email.helpers";

export const __dirnameAtSrcLevel = __dirname.replace(/src$/, '');

async function main() {
    console.log('Starting Backupper');
    executeCronJobs();
    // console.log(tellMeDirnameFromEmail());
}
main();