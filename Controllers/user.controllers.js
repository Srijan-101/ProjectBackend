const PasswordManager = require("./Helper/PasswordManager/PasswordManager");

const { PrismaClient } = require("@prisma/client");
const { user } = new PrismaClient();

const jwt = require("jsonwebtoken");

const { Verification,passwordReset } = require("./Helper/SendEmail/SendMessage");



// @route POST api/users/register
// @desc Register user
// @access Public
exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, password, email, role } = req.body;
    const getUser = await user.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (getUser) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      try {
        const hashedpassword = new PasswordManager(password).getHashedPassword();
        jwt.sign(
          { email, firstName, lastName },
          process.env.JWTSECRET,
          { expiresIn: 1600 },
          async (err, result) => {
            if (err)
              res
                .status(400)
                .json({ message: "Server error.Please try again later." });
            Verification(email, result)
              .then(async () => {
                const Useruser = await user.create({
                  data: {
                    firstName,
                    lastName,
                    email:email.toLowerCase(),
                    role,
                    password: hashedpassword,
                    resetPasswordLink : ''
                  },
                });
                if (Useruser) {
                  return res.status(200).json({
                    message: `Email has been send to ${email}.Follow the instruction to activate your account.`,
                  });
                } else
                  res
                    .status(400)
                    .json({ message: "Server error.Please try again later." });
              })
              .catch((err) => {
                console.log(err);
                res
                  .status(400)
                  .json({ message: "Server error.Please try again later." });
              });
          }
        );
      } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Server error.Please try again later." });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Server error.Please try again later." });
  }
};

// @route POST api/users/activate
// @desc Activate user /update isActivate:Boolean data
// @access Public
exports.Activateaccount = async (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWTSECRET, async (err, sucess) => {
      if (err) {
        return res.status(400).json({
          error: "Expired Link.Login and try again",
        });
      }
      const { email } = jwt.decode(token);
      const data = await user.findFirst({
        where: {
          email:email.toLowerCase()
        },
        select: {
          isActivate: true,
        },
      });
      if (data.isActivate) {
        return res.status(200).json({
          message: "Your account is already verified.Please Login to continue.",
        });
      }
      const updateActivation = await user.update({
        where: {
          email,
        },
        data: {
          isActivate: true,
        },
      });
      if (updateActivation) {
        return res.status(200).json({
          message: "Verified.Please Login to continue",
        });
      } else {
        return res.status(401).json({
          message: "Something went wrong.Please try again.",
        });
      }
    });
  }
};

// @route GET api/users/login
// @desc Login user / Returning JWT Token
// @access Public
exports.Login = async (req, res) => {
  const { email, password } = await req.body;
  try {
    const findUserbyEmail = await user.findFirst({
      where: {
        email :email.toLowerCase(),
      },
    });
    if (!findUserbyEmail) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const payload = {
        id: findUserbyEmail.id,
        firstName: findUserbyEmail.firstName,
        lastName: findUserbyEmail.lastName,
        email: findUserbyEmail.email.toLocaleLowerCase(),
        isActivate: findUserbyEmail.isActivate,
        role: findUserbyEmail.role,
        post : findUserbyEmail.Post,
        outletId : findUserbyEmail.outletId
      };
      jwt.sign(
        payload,
        process.env.JWTSECRET,
        { expiresIn: '10h' },
        (err, token) => {
          if (err) {
            return res.status.json({
              message: "Server error.Please try again later.",
            });
          }
          if (
            new PasswordManager(password).checkPassword(
              findUserbyEmail.password
            )
          ) {
            return res.status(200).json({
              token:token,
            });
          }
          return res.status(400).json({ message: "Password Incorrect" });
        }
      );
    }
  } catch (error) {
    res.status(400).json({ message: "Server error.Please try again later." });
  }
};


// @route GET api/users/resendVerify
// @desc Return JWT token
// @access Private
exports.resendVerify = async (req, res) => {
  const { email } = req.body;

  const userR = await user.findFirst({
    where: {
      email,
    },
    select: {
      isActivate: true,
      email: true,
      id: true,
    }
  });


  if (userR.isActivate) {
    return res.status(400).json({
      error: "Email address is already verified.Please login to continue.",
    })
  } else {
    jwt.sign(userR, process.env.JWTSECRET, (err,result) => {
      if (err) {
        return res.status(401).json({
          error: "Something went wrong.Please try again.",
        });
      } else {
        Verification(email,result)
          .then(() => {
            return res.status(200).json({
              message: `Email has been send to ${email}.Follow the instruction to activate your account.`,
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(401).json({
              message: "Something went wrong.Please try again.",
            });
          });
      }
    });
  }
};




// @route GET api/users/resendPassword
// @desc Return void
// @access Public
exports.passwordReset = async (req, res) => {
  const { email } = req.body;
  const FindbyEmail = await user.findFirst({
    where: {
      email,
    },
    select: {
      email: true
    }
  });
  if (!FindbyEmail) {
    return res.status(404).json({ message: "User not found" });
  } else {
    jwt.sign(FindbyEmail, process.env.JWTSECRET, async (error, result) => {
      const Useruser = await user.update({
        data: {
             resetPasswordLink : result
        },
        where: {
          email,
        }
      });
      if (Useruser) {
        passwordReset(email, result)
          .then(() => {
            return res.status(200).json({
              message: `Email has been send to ${email}.Follow the instruction to reset your password.`,
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(401).json({
              message: "Something went wrong.Please try again.",
            });
          });
      } else {
        res
          .status(400)
          .json({ message: "Server error.Please try again later." });
      }
    });
  }
}

// @route GET api/changePassword
// @desc Return void
// @access Private works with JWT
exports.changePassword = async (req, res) => {
  const { token, password } = req.body;
  jwt.verify(token, process.env.JWTSECRET, async (err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Expired Link.Login and try again",
      });
    }
    const { email } = jwt.decode(token);
    const User = await user.findFirst({
      where: {
        email
      },
      select: {
         resetPasswordLink:true
      }
    }).catch((e) => console.log(e))
    if (User.resetPasswordLink === token) {
      const hashedpassword = new PasswordManager(password).getHashedPassword();
      const Update = await user.update({
        data: {
          password: hashedpassword
        },
        where: {
          email
        }
      }).then(async () => {
        try {
           await user.update({
              data : {
                resetPasswordLink : ' '
              },
              where : {
                email
              }
           })
        }catch(e){
            console.log(e);
            return res.status(400).json({
              error: "Expired Link.Login and try again",
            });
        }

        return res.status(200).json({
          message: `Password reset sucessful.Please login`,
        });
      }).catch((err) => console.log(err));
    } else {
      return res.status(400).json({
        error: "Expired Link.Login and try again",
      });
    }
  })
}







// @route GET api/users/current
// @desc Return current user
// @access Private
exports.Current = (req, res) => {
  res.json(req.user);
};


