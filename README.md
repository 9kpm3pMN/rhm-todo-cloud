# Red Hat Mobile Todo MBaaS Server

This is a basic FeedHenry MBaaS Cloud application. Used as a sample backend for AngularJS toDo app.

# Group todo API

# todo [/todo]

'Hello world' endpoint.

## todo [GET]

'Get All todo tasks' endpoint.

+ Request (application/json)
    + Body
            {}

+ Response 200 (application/json)
    + Body
            {
              "returnData": [<array of tasks>]
            }


## todo [POST]

'Create task' endpoint.

+ Request (application/json)
    + Body
            {
              "taskToSave": "world"
            }

+ Response 200 (application/json)
    + Body
            {
              "returnData": [<array of tasks>]
            }


## todo [PUT]

'Update task' endpoint.

+ Request (application/json)
    + Body
            {
              "taskId": <guid of mongo document>,
              "data": <updated document to persist>
            }

+ Response 200 (application/json)
    + Body
            {
              "returnData": [<array of tasks>]
            }


## todo [DELETE]

'Delete task' endpoint.

+ Request (application/json)
    + Body
            {
              "taskId": <guid of mongo document>,
            }

+ Response 200 (application/json)
    + Body
            {
              "returnData": [<array of tasks>]
            }
