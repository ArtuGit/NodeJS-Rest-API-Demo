const express = require('express');
const auth = require('../../middlewares/auth');
const authCustom = require('../../middlewares/authCustom');
const groupController = require('../../controllers/group.controller');
const validate = require('../../middlewares/validate');
const groupValidation = require('../../validations/group.validation');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(groupValidation.createGroup), groupController.createGroup)
  .get(validate(groupValidation.getGroups), groupController.getGroups);

router
  .route('/:groupId')
  .get(authCustom(), validate(groupValidation.getGroup), groupController.getGroup)
  .patch(authCustom(), validate(groupValidation.updateGroup), groupController.updateGroup)
  .delete(authCustom(), validate(groupValidation.deleteGroup), groupController.deleteGroup);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group management and retrieval
 */

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Create a group
 *     description: Any user can create groups.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - private
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               private:
 *                 type: boolean
 *               image:
 *                 type: string
 *             example:
 *               name: new group
 *               description: new group description
 *               private: false
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Group'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get public groups
 *     description: Anonymous and any users can retrieve public groups.
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Group name
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Group description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of groups
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Group'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 */

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     summary: Get a group
 *     description: Anonymous and any users can fetch public group, project admins can fetch any group, group admins and group members can fetch their own private group.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Group'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a group
 *     description: Logged in users can only update their own groups. Only admins can update any groups.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - private
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               private:
 *                 type: boolean
 *               image:
 *                 type: string
 *             example:
 *               name: changed group name
 *               description: changed group description
 *               private: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a group
 *     description: Logged in users can only delete their own groups. Only admins can delete any groups.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
