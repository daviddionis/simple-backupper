import { executeCronJobs } from "./cronjobs/index.cronjobs";



async function main() {
    console.log('Starting Backupper');
    executeCronJobs();
}
main();