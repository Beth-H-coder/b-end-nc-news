Additional Set-up Requirements:

In order to successfully connect to the two databases locally, two .env files are required to alternate between the development and testing environments.

1. Create 2 .env files and label them:

   1. .env.development
   2. .env.test.

2. Add the following to the .env.development file:

   PGDATABASE=<nc_news>

3. Add the following to the .env.test file.

   PGDATABASE=<nc_news_test>

The package.json includes all other files required to run this project.
