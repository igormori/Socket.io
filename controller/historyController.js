var history = require('../model/historyModel')

exports.registerHystory = async function (req, res) {
    try{
        await history.create({
            user:req.body.user,
            message:req.body.message,
            date:req.body.date,
            time: req.body.time,
            room: req.body.room
        })
        res.status(200).send({
            message: req.body.user
        })}
        catch(error){
            res.status(404).send({
                message: req.body.user,
                error:error.message
            })
        }
    }

