/**
 * express - nodejs framework
 * router - express router for routing
 * nanoid - for storing each record with unique id
 */
const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const idLength = 8;

/**
 * @swagger
 * components:
 *  schemas:
 *      Meme:
 *          type: object
 *          required:
 *            - name
 *            - url
 *            - caption
 *          properties:
 *              id:
 *                 type: string
 *                 description: Auto Generated unique id for each meme
 *              name:
 *                  type: string
 *                  description: Name of the meme poster
 *              url:
 *                  type: string
 *                  description: Link of the meme
 *              caption:
 *                  type: string
 *                  description: caption of meme
 *          example:
 *              id: f5_/t1I9
 *              name: Utkarsh
 *              url: https://crio-assets.s3.ap-south-1.amazonaws.com/beaver-logo.png
 *              caption: Crio-winterOfDoing
 *      ID:
 *        type: object
 *        required:
 *          - id
 *        properties:
 *          id:
 *            type: string
 *            description: Id of the posted meme
 *        example:
 *          id: f5_/t1I9
 *
 *
 */

/**
 * @swagger
 * tags:
 *     name: Memes
 *     description: The Meme Stream API
 */

/**
 * @swagger
 * schemes:
 * /memes:
 *     get:
 *         summary:  Returns the list of all memes
 *         tags: [Memes]
 *         responses:
 *             200:
 *                 description: The list of all memes
 *                 content:
 *                     application/json:
 *                         schema:
 *                             type: array
 *                             items:
 *                             $ref: '#/components/schemas/Meme'
 *
 */
router.get('/', (req, res) => {
  const memes = req.app.db.get('memes');
  const memes_ = [...memes].reverse();
  res.send(memes_);
});

/**
 * @swagger
 * /memes/{id}:
 *   get:
 *     summary: Get the meme by id
 *     tags: [Memes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The meme id
 *     responses:
 *       200:
 *         description: The meme description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meme'
 *       404:
 *         description: The Meme was not found
 */

router.get('/:id', (req, res) => {
  const meme = req.app.db.get('memes').find({ id: req.params.id }).value();
  if (!meme) res.sendStatus(404);
  res.send(meme);
});

/**
 * @swagger
 * /memes:
 *   post:
 *     summary: Create a new meme
 *     tags: [Memes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meme'
 *     responses:
 *       200:
 *         description: The meme was successfully created
 *         content:
 *           application/json:
 *             schema:
 *                  type: object
 *                  required:
 *                      - id:
 *                  properties:
 *                      id:
 *                          type: string
 *                          description: Auto Generated unique id for each meme
 *                  example:
 *                          id: f5_/t1I9
 *
 *       409:
 *         description: Duplicate Meme
 *       422:
 *         description: Insufficient Data to create meme
 *       500:
 *         description: Some server error
 */

router.post('/', (req, res) => {
  try {
    const { name, url, caption } = req.body;
    if (!name || !url || !caption) return res.status(422).json();
    const meme = {
      id: nanoid(idLength),
      name: name,
      url: url,
      caption: caption,
    };

    if (
      typeof req.app.db
        .get('memes')
        .find({ name: meme.name, url: meme.url, caption: meme.caption })
        .value() != 'undefined'
    )
      res.sendStatus(409);
    else {
      req.app.db.get('memes').push(meme).write();
      res.json({ id: meme.id });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /memes/{id}:
 *  patch:
 *    summary: Update the meme by its id
 *    tags: [Memes]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Meme id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Meme'
 *    responses:
 *      200:
 *        description: The Meme was updated
 *      404:
 *        description: The Meme was not found
 *      405:
 *        description: Name change not allowed
 *      422:
 *        description: Meme with same details already exists
 *      500:
 *        description: Some server error
 */

router.patch('/:id', (req, res) => {
  try {
    if (
      typeof req.app.db.get('memes').find({ id: req.params.id }).value() ==
      'undefined'
    )
      res.sendStatus(404);
    if (req.body.name) res.sendStatus(405);
    const name = req.app.db.get('memes').find({ id: req.params.id }).value()
      .name;
    if (
      typeof req.app.db
        .get('memes')
        .find({ name: name, url: req.body.url, caption: req.body.caption })
        .value() != 'undefined'
    )
      res.sendStatus(422);
    else {
      req.app.db
        .get('memes')
        .find({ id: req.params.id })
        .assign(req.body)
        .write();
      res.sendStatus(200);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /memes/{id}:
 *   delete:
 *     summary: Remove the meme by id
 *     tags: [Memes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The meme id
 *
 *     responses:
 *       200:
 *         description: The meme was deleted
 *       404:
 *         description: The meme was not found
 */

router.delete('/:id', (req, res) => {
  if (
    typeof req.app.db.get('memes').find({ id: req.params.id }).value() ==
    'undefined'
  )
    return res.sendStatus(404);
  else {
    req.app.db.get('memes').remove({ id: req.params.id }).write();
    return res.sendStatus(200);
  }
});

module.exports = router;
