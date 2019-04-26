// implement your API here
const express = require('express')
const db = require('../data/helpers/actionModel')

const router = express.Router()

router.get('/', (req, res) => {
  db.get()
    .then(actions => {
      res.status(201).json(actions)
    })
    .catch(e => {
      res.status(500).json({ error: 'The actions information could not be retrieved.' })
    })
})

router.get('/:id', (req, res) => {
  const actionId = req.params.id
  db.getById(actionId)
    .then(action => {
      if (!action) {
        res.status(404).json({ message: 'The action with the specified ID does not exist.' })
      } else {
        res.status(201).json(action)
      }
    })
    .catch(e => {
      res.status(404).json({ error: 'The action information could not be retrieved.' })
    })
})

router.post('/', (req, res) => {
  const newAction = req.body
  if (newAction.project_id === '' || newAction.description === '' || newAction.project_id == 3) {
    res.status(400).json({ errorMessage: 'Please provide a description and project id for the action.' })
  } else {
    db.insert(newAction)
      .then(action => {
        res.status(201).json(action)
      })
      .catch(e => {
        res.status(500).send({ error: 'There was an error while saving the action to the database' })
      })
  }
})

router.put('/:id', (req, res) => {
  const actionId = req.params.id
  const newAction = req.body
  if (!newAction.description || newAction.description === '' && !newAction.project_id || newAction.project_id === '') {
    // console.log(newAction)
    res.status(400).json({ errorMessage: 'Please provide a description and project id for the action.' })
  } else {
    db.update(actionId, req.body)
      .then(num => {
        if (num === 0) {
          res.status(404).json({ message: 'The action with the specified ID does not exist.' })
        } else {
          res.status(200).json(num)
        }
      })
      .catch(e => {
        res.status(500).json({ error: 'The action information could not be modified.' })
      })
  }
})

router.delete('/:id', (req, res) => {
  const actionId = req.params.id
  db.remove(actionId).then(num => {
    if (num === 0) {
      res.status(404).json({ message: 'The action with the specified ID does not exist.' })
    }
    res.status(200).json(num)
  }).catch(e => {
    console.log(e)
  })
})

module.exports = router
