# Western Union Location Retrieval

Retrieve Western Union locations by Country and City. 
The script will loop through the array of countries and cities
and retrieve all locations within that query. After the results
are retrieved, they are written out to separate CSV files in the
`/data` directory. See `data/wu-locations-for-DO-Santo-Domingo.csv`
for an example of the output.

### Installation [run commands in Terminal]

+ Ensure you have `node.js` installed
```bash
node --version
```
+ Install dependencies
```bash
npm install
```
+ Run application
```bash
node index.js
```
