const bcrypt = require('bcrypt');

module.exports = class PasswordManager {
     constructor(plainPassword){
          this.plainPassword = plainPassword
     }

     getHashedPassword(){
          const salt =  bcrypt.genSaltSync(Math.random(new Date() * 10));
          const getHashPassword = bcrypt.hashSync(this.plainPassword,salt);
          return getHashPassword;
     }

     checkPassword(hashedpassword){
          return bcrypt.compareSync(this.plainPassword,hashedpassword)
     }
}


