const router = require('express').Router()
const database = require('../../data/db')

//GET
router.get('/', (req, res) => {
    database.find(req.query)
        .then(hubs => {
            res.status(200).json(hubs);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the hubs',
            });
        });
});

router.get('/:id', (req, res) => {
    database.findById(req.params.id)
        .then(post => {
            if (post[0]) {

                res.status(200).json(post)
            } else {
                res.status(404).json({
                    errorMessage: 'Error 404: No post found with specified ID'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                errorMessage: 'Error 500: This is a server side error. If this error persists contact your server admin. '
            })
        })
})

router.get('/:id/comments', (req, res) => {
    database.findPostComments(req.params.id)
        .then(comments => {
            if (comments[0]) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({
                    errorMessage: "The post with the specified ID does not exist."
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                errorMessage: 'Error 500: This is a server side error. If this error persists contact your server admin. '
            })
        })
})
//POST
router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        database.insert(req.body)
            .then(data => {

                res.status(201).json(data)
            })
            .catch(error => {
                console.log(err)
                res.status(500).json({
                    errorMessage: 'Error 500: This is a server side error. If this error persists contact your server admin. '
                })
            })
    }
})

router.post('/:id/comments', (req, res) => {
    const { text } = req.body
    // const { id } = req.params
    const post_id = req.params.id
    database.findById(req.params.id)
        .then(post => {
            if (!post[0]) {

                res.status(404).json("The post with the specified ID does not exist.")
            }
        })

    if (!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide contents for the post." })
    } else {
        database.insertComment({ text, post_id })
            .then(data => {
                console.log(data.id)
                if (data) {
                    res.status(201).json(data)
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })

            .catch(error => {
                console.log(error)
                res.status(500).json({
                    errorMessage: 'Error 500: This is a server side error. If this error persists contact your server admin. '
                })
            })
    }
})
//DELETE
router.delete('/:id', (req, res) => {
    database.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'The post has been removed' });
            } else {
                res.status(404).json({ message: 'The post could not be found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error removing the post',
            });
        });
})
//PUT
router.put('/:id', (req, res) => {
    database.findById(req.params.id)
        .then(post => {
            if (!post[0]) {

                res.status(404).json("The post with the specified ID does not exist.")
            }
        })

    database.update(req.params.id, req.body)
        .then(count => {
            if (count) {
                res.status(201).json(count)
            } else {
                res.status(404).status.json({
                    errorMessage: 'Specified post does not exist'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                errorMessage: 'Error 500: This is a server side error. If this error persists contact your server admin. '
            })
        })
})
module.exports = router