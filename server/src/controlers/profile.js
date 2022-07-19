const { profile, user } = require("../../models");

// Fetch profile
exports.getProfile = async (req, res) => {
    try {
        let data = await profile.findOne({
            where: {
                idUser: req.user.id
            },
            include: [
                {
                  model: user,
                  as: "user",
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "password"],
                  },
                },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        data = JSON.parse(JSON.stringify(data));

        data = {
          ...data,
          image: process.env.PATH_FILE + data.image,
        };

        res.send({
            status: 'success',
            data,
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

// Update category by id
exports.updateProfile = async (req, res) => {
    try {
        const dataProfile = {
            phone: req?.body?.phone,
            gender: req?.body?.gender,
            address: req?.body?.address,
            image: req?.file?.filename,
          };

        await user.update({ name: req?.body?.name }, {
            where: {
                id: req.user.id
            }
        })

        await profile.update( dataProfile, {
            where: {
                idUser: req.user.id
            }
        })

        const profileData = await profile.findOne({
            where: {
              idUser: req.user.id
            },
            include: [
              {
                model: user,
                as: "user",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "password"],
                },
              },
            ],
            attributes: {
              exclude: ["createdAt", "updatedAt", "idUser"],
            },
          });

        res.send({
            status: 'success',
            message: `Update profile id: ${id} finished`,
            data: { profileData, image: req?.file?.filename }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}