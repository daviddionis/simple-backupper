
### Backupper via SFTP and Email

A simple NodeJS script to backup a folder or MySQL database via SFTP and/or Email.
It only accepts a SFTP configuration and a Email configuration, but you can use both at the same time.

You can use it to backup multiple folders and/or databases. Each one can have differents destinations (folders or email addresses).

Multiple configurations for SFTP and Email are expected to be available soon.

#### Installation & Run

1. Install dependencies: `npm install`
2. Duplicate the `config-sample.ts` file and rename it to `config.ts`.
3. Configure the `config.ts` file.
4. Build: `npm run build`
5. Run the script from the build folder:
   1. With NodeJS: `node src/index.js`
   2. With PM2: `pm2 start src/index.js --name "backupper"`
6. Enjoy!

@daviddionis