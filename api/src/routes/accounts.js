const Joi = require("@hapi/joi");
const router = require("express").Router();

const { db } = require("../db");

// Get Accounts
router.get("/", async (req, res) => {
  const accounts = await db("Accounts");

  res.json(accounts);
});

// Create Accounts
const postAccountsBodySchema = Joi.object().keys({
  accounts: Joi.array().items(Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string()
  }))
});

router.post("/", async (req, res) => {
  const { error } = postAccountsBodySchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const { accounts } = req.body;

  await db("Accounts").insert(accounts);

  return res.status(200).end();
});

// Delete Account
const deleteAccountsParamsSchema = Joi.object().keys({
  id: Joi.number().integer().required()
});

router.delete("/:id", async (req, res) => {
  const { error } = deleteAccountsParamsSchema.validate(req.params);
  if (error) {
    return res.status(400).send(error);
  }

  const { id } = req.params;

  await db("Accounts").where({ id }).delete();

  return res.status(200).end();
});

module.exports = router;
