# https-practice-server
A Localhost server with JSON database to practice HTTPS Requisition and Responses

## GET
http://localhost:3000/          - Stantard GET of db.json

## POST
http://localhost:3000/create    - Post of data, data must be on requisition.body

## DELETE
http://localhost:3000/del/id    - Delete data of specified id

## PATCH
http://localhost:3000/update/id - Update data of specified id, data must be on requisition.body. You can't change id property.
