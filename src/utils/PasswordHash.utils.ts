import { generate, verify, isHashed } from 'password-hash';
import { StringUtils } from './String.utils';

export class PasswordHashUtils {
  public static toHash(password : string){
    if (StringUtils.isEmpty(password)){
      return '';
    }

    return generate(process.env.PASSWORD_SALT + password);
  }

  public static isValid(password : string, passwordHashed : string){
    if (StringUtils.isEmpty(password) || StringUtils.isEmpty(passwordHashed)){
      return false;
    }

    return verify(process.env.PASSWORD_SALT + password, passwordHashed);
  }
}