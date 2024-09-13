# NodeJS-Rest-API-Demo

## Source

This project is based on
[RESTful API Node Server Boilerplate](https://github.com/hagopj13/node-express-boilerplate) and extends the functionality by groups.

##  Added Feature - Groups

- Users can create and manage their groups
- Admin can manage groups
- A group can be public or private
- A user can add herself to any public group
- All public groups can be requested
- Private groups can be requested by group admins

## Developments

- [Groups Model](https://github.com/ArtuGit/NodeJS-Rest-API-Demo/blob/master/src/models/group.model.js)
- [Groups Routes and Swagger Docs](https://github.com/ArtuGit/NodeJS-Rest-API-Demo/blob/master/src/routes/v1/group.route.js)
- [Groups Controllers](https://github.com/ArtuGit/NodeJS-Rest-API-Demo/blob/master/src/controllers/group.controller.js)
- [Groups Services](https://github.com/ArtuGit/NodeJS-Rest-API-Demo/blob/master/src/services/group.service.js)
- [Groups Validations](https://github.com/ArtuGit/NodeJS-Rest-API-Demo/blob/master/src/validations/group.validation.js)
- [Groups Authentication](https://github.com/ArtuGit/NodeJS-Rest-API-Demo/blob/master/src/services/group.service.js#L13)
- [Groups Unit Tests](https://github.com/ArtuGit/NodeJS-Rest-API-Demo/tree/master/tests/unit)
- [Groups Integration Tests](https://github.com/ArtuGit/NodeJS-Rest-API-Demo/blob/master/tests/integration/group.test.js)
- [Github CI: Build, Test, and Deploy](https://github.com/ArtuGit/NodeJS-Rest-API-Demo/tree/master/.github/workflows)


