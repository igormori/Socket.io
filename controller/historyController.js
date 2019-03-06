var history = require('../model/historyModel')

exports.registerHistories = async function (req, res) {
    try{
        await history.create({
            user:req.body.user,
            date:req.body.date,
            time: req.body.time,
            room: req.body.room,
            connected: req.body.connected
        })
        res.status(200).send({
            message: "Done!"
        })}
        catch(error){
            res.status(404).send({
                message: req.body.user,
                error:error.message
            })
        }
        
    }



exports.editOne = async function (req, res) {
    try {
        await history.updateOne({user:req.params.user}, {
            connected: req.body.connected
        })
        res.status(200).send({
            message: "Done!"
        })
    } catch (error) {
        res.status(404).send({
            message: "Error to edit",
            error: error.message
        })
    }
}


exports.getHistory = async function(req,res){
    try{
        let getHystory = await history.find()
        res.status(200).send(getHystory)
    }catch(error){
        res.status(400).send({
            message:"no data",
            error:error.message

        })
    }
}