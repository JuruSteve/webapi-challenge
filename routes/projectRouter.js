const express = require('express')
const db = require('../data/helpers/projectModel')
const router = express.Router()

router.get('/', (req, res) => {
  db.get()
    .then(projects => {
      res.status(201).json(projects)
    })
    .catch(e => {
      res.status(500).json({ error: 'The projects information could not be retrieved.' })
    })
})

router.get('/:id/actions', (req, res) => {
  db.getProjectActions(req.params.id)
    .then(usersprojects => {
      res.status(201).json(usersprojects)
    })
    .catch(e => {
      res.status(500).json({ error: 'The project\'s actions information could not be retrieved.' })
    })
})

router.get('/:id', (req, res) => {
  const projectId = req.params.id
  db.getById(projectId)
    .then(project => {
      if (!project) {
        res.status(404).json({ message: 'The project with the specified ID does not exist.' })
      } else {
        res.status(201).json(project)
      }
    })
    .catch(e => {
      res.status(404).json({ error: 'The project information could not be retrieved.' })
    })
})

router.project('/', (req, res) => {
  const newproject = req.body
  if (newproject.name === '' || newproject.descriptions === '') {
    res.status(400).json({ errorMessage: 'Please provide name and descriptions for the project.' })
  } else {
    db.insert(newproject)
      .then(project => {
        res.status(201).json(project)
      })
      .catch(e => {
        res.status(500).send({ error: 'There was an error while saving the project to the database' })
      })
  }
})

router.put('/:id', (req, res) => {
  const projectId = req.params.id
  const newproject = req.body
  if (!newproject.description || newproject.description === '' && !newproject.name || newproject.name === '') {
    // console.log(newproject)
    res.status(400).json({ errorMessage: 'Please provide name and descriptions for the project.' })
  } else {
    db.update(projectId, req.body)
      .then(num => {
        if (num === 0) {
          res.status(404).json({ message: 'The project with the specified ID does not exist.' })
        } else {
          res.status(200).json(num)
        }
      })
      .catch(e => {
        res.status(500).json({ error: 'The project information could not be modified.' })
      })
  }
})

router.delete('/:id', (req, res) => {
  const projectId = req.params.id
  db.remove(projectId).then(num => {
    if (num === 0) {
      res.status(404).json({ message: 'The project with the specified ID does not exist.' })
    }
    res.status(200).json(num)
  }).catch(e => {
    res.status(500).json({ error: 'The project could not be removed.' })
  })
})

module.exports = router
