const express = require('express');
const auth = require('../../middlewares/auth');
const groupController = require('../../controllers/group.controller');
const validate = require('../../middlewares/validate');
const groupValidation = require('../../validations/group.validation');

const router = express.Router();

router.route('/').post(auth(), validate(groupValidation.createGroup), groupController.createGroup);

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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *             example:
 *               name: new group
 *               description: new group description
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
 */
