const {category} = require("../../models")

exports.addCategory = async (req, res) => {
    try {

    const data = await category.create(req.body);

     res.status(201).send({
        status:"succes",
        data:{
            category:data
        }
    })
    } catch (error) {
        res.status(401).send({
            status:"failed",
            message:"server eror"
        })
    }
}


exports.getCategorys = async (req, res) => {
try {

    const data = await category.findAll({attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      }
    });

        res.status(201).send({
        status:"succes",
        data:{
            category:data
        }
    })
    } catch (error) {
        res.status(401).send({
            status:"failed",
            message:"server eror"
        })
    }
}

exports.getCategory = async (req, res) =>{
    try {
        const {id} = req.params
        const data = await category.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });
       
        res.status(200).send({
            status:"succes",
            data:{
                category:data
            }
        })
        } catch (error) {
            res.status(400).send({
                status:"failed",
                message:"server eror"
            })
        }
}

exports.deleteCategory = async (req, res) =>{
    try {
        const {id} = req.params
        await category.destroy({
            where: {
              id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });
        res.status(200).send({
            status:"succes",
            data:{
                category:`${id}`
            }
        })
        } catch (error) {
            res.status(400).send({
                status:"failed",
                message:"server eror"
            })
        }
}

exports.updateCategory = async (req, res) =>{
    try {
        const {id} = req.params
        const data = await category.update(req.body, {
          where: {
            id,
          },
        });
    
        res.status(201).send({
          status: "success",
            data:{
                category: data
            }
        });
      } catch (error) {
        console.log(error);
        res.status(400).send({
          status: "failed",
          message: "Server Error",
        });
      }
    };