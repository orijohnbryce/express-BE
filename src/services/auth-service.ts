import { runQuery } from "../db/dal";
import { UnauthorizedError } from "../models/exceptions";
import UserModel from "../models/user-model";
import { createToken } from "../utils/auth-utils";

export async function createUser(user: UserModel) {
  user.validate();

  // create user (new id will generated)
  let q = `insert into user (username, email, password) values (?, ?, ?)`;      
  console.log(q);
  await runQuery(q, [user.username, user.email, user.password]); 

  
  // get create id
  q = `select id from user where email=?`;
  const res = await runQuery(q, [user.email]);    
  user.id = res[0].id;
  
  
  // create new token and save it to db
  user.token = createToken(user);
  q = 'update user set token=? where email=?';
  await runQuery(q, [user.token, user.email]);

  return user.token;
}


export async function login(email: string, password: string) {
  /* if credentials are OK, will return new token (and save it in db)  */

  let q = `select * from user where email=?
                AND password=?;`;

  let qParams = [email, password];

  const res = await runQuery(q, qParams);
  if (res.length !== 1) {
    throw new UnauthorizedError("email or password incorrect!");
  }

  // create token:
  const token = createToken(new UserModel(res[0]));
  q = `update user set token=? where email=?`;
  qParams = [token, email];
  await runQuery(q);
  return token;
}
