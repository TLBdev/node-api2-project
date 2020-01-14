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
            if (post) {
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
    database.findById(req.params.id)
        .then(comments => {
            if (comments) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({
                    errorMessage: 'Error 404: Cannot find data at specified location.'
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