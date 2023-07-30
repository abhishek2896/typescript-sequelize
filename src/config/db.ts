import { Sessions, Users } from '../models'
import config from './config'
import { AuthUtils } from '../utils'
import { UserInput } from '../models/users.models'
import { v4 as uuidv4 } from 'uuid'

const isDev = config.env === 'development'
const isTest = config.env === 'test'

const dbInit = async () => {
  console.info('\n==========>>>>>>>> syncing db...\n')
  try {
    await Users.sync({ alter: isDev, force: isTest })
    await Sessions.sync({ alter: isDev, force: isTest })
    console.log('\n==========>>>>>>>> db synced successfully\n')

    // check if admin user exists
    if (config.env !== 'test') {
      console.info('\n==========>>>>>>>> checking admin user...\n')
      const adminUser: Users = await Users.findOne({ where: { isAdmin: true } }) as Users;
      if (!adminUser) {
        const salt: string = AuthUtils.generateSalt();
        const userObj: UserInput = {
          name: config.adminUserName,
          email: config.adminUserEmail,
          salt,
          id: uuidv4(),
          isAdmin: true,
          password: AuthUtils.encryptPassword(config.adminUserPassword, salt)
        };
        try {
          await Users.create(userObj);
          console.log('\n==========>>>>>>>> admin user created successfully\n')
        } catch (error) {
          console.log('\n==========>>>>>>>> admin user creation failed\n', error)
          process.exit(1)
        }
      } else {
        console.log('\n==========>>>>>>>> admin user already exists\n')
      }
    }


  } catch (error: any) {
    console.error('error', error)
  }
}
export default dbInit 