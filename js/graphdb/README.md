# curl REST API samples

## NodeJS

See: [sparql-client-2](https://www.npmjs.com/package/sparql-client-2)

## Query Something

    $ curl -G -H "Accept:application/x-trig"
		-d query=CONSTRUCT+%7B%3Fs+%3Fp+%3Fo%7D+WHERE+%7B%3Fs+%3Fp+%3Fo%7D+LIMIT+10
		http://localhost:7200/repositories/yourrepository

## List Repos

    $ curl -G http://localhost:7200/rest/repositories \
		-H 'Accept: application/json' 

## List Locations

    $ curl http://localhost:7200/rest/locations\
    		-H 'Accept: application/json'

## Attach Location

    $ curl -X PUT http://localhost:7200/rest/locations\
		-H 'Content-Type:application/json'\
		-d '{
			"uri": "localhost:7200/",
			"username": "admin",
			"password": "root"
		}'

## Activate a Location

    $ curl -X POST http://localhost:7200/rest/locations/activate\
    		-H 'Content-Type:application/json'\
		-d '{
	        	"uri": "http://localhost:7200/"
		}'

## Detach a Location

    $ curl -G -X DELETE http://localhost:7200/rest/locations\
		-H 'Content-Type:application/json'\
		-d uri=http://localhost:7200/
