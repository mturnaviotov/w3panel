server='http://localhost:3000/'
api='api/v1/'

# recieve auth token (used data from db/seeds)
token=`curl -s -X POST -H 'Content-Type: application/json' -d '{"user":{"email":"user@example.com","password":"123info@example.com321"}}' \
 ${server}${api}user/sign_in | jq .token | tr -d '"'`

# echo $token

# auth for showing user profile test
curl -H "AUTH_TOKEN: $token" ${server}${api}user/
