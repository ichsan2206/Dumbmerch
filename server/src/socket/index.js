// import models
const {chats, user, profile} = require("../../models")
// import here
const jwt = require('jsonwebtoken')

const {Op} = require('sequelize')

// init variable here
let connectedUser = {}

const socketIo = (io) => {

  // create middlewares before connection event
  // to prevent client access socket server without token
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token ) {
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on('connection', async (socket) => {
    console.log('client connect: ', socket.id)
    
    // code here
    const { id: idUser } = jwt.verify(socket.handshake.auth.token, process.env.TOKEN_KEY)
    connectedUser[idUser] = socket.id

    // define listener on event load admin contact
    socket.on("load admin contact", async () => {
      try {
        const adminContact = await user.findOne({
          include: [
            {
              model: profile,
              as: "profile",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          where: {
            status: "Admin"
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });
    
        socket.emit("admin contact", adminContact)
      } catch (err) {
        console.log(err)
      }
    })

    // define listener on event load customer contact
    socket.on("load customer contacts", async () => {
      try {
        let customerContacts = await user.findAll({
          where: {
            status: 'Customer'
          },
          include: [
            {
              model: profile,
              as: "profile",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: chats,
              as: "recipientMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
            {
              model: chats,
              as: "senderMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        })

        customerContacts = JSON.parse(JSON.stringify(customerContacts))
        customerContacts = customerContacts.map((item) => ({
          ...item,
          profile: {
            ...item.profile,
            image: item.profile?.image ? process.env.PATH_FILE + item.profile?.image : null,
          },
        }))
        
        socket.emit("customer contacts", customerContacts)
      } catch (err) { 
        console.log(err)
      }
    })

    // code here
    socket.on("load messages", async (payload) => {
      const idRecipient = payload;
      const idSender = idUser;

      const data = await chats.findAll({
        where: {
          idSender: {
            [Op.or]: [idRecipient,idSender]
          },
          idRecipient: {
            [Op.or]: [idRecipient,idSender]
          },
        },
        include: [
          {
            model: user,
            as: 'recipient',
            attributes: {
              exclude: ['createdAt','updatedAt', 'password']
            }
          },
          {
            model: user,
            as: 'sender',
            attributes: {
              exclude: ['createdAt','updatedAt', 'password']
            }
          }
        ],
        attributes: {
          exclude: ['createdAt','updatedAt', 'idRecipient', 'idSender']
        },
        order: [['createdAt','ASC']]
      })

      socket.emit('messages',data)
    })


    socket.on("send message", async (payload) => {
      try {
        const { message, idRecipient } = payload       
        
        await chats.create({
          message,
          idRecipient,
          idSender: idUser
        })
        
        io.to(socket.id).to(connectedUser[idRecipient]).emit("new message")
      } catch (error) {
        console.log(error)
      }
    })    

    socket.on("disconnect", () => {
      console.log("client disconnected", socket.id)
      delete connectedUser[idUser]
    })
  })
}

module.exports = socketIo