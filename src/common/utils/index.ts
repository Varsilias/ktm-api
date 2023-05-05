import * as bcrypt from 'bcrypt';

export class Utils {
  public static async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  public static comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
