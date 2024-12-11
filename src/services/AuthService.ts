import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Log from '../models/Log';

class AuthService {

  async isEmailRegistered(email: string): Promise<boolean> {
    const existingUser = await User.findOne({ where: { email } });
    return !!existingUser; 
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    await Log.create({ userId: user.id, action: 'LOGIN' });

    return token;
  }

  async register(name: string, email: string, password: string) {
    const existingUser = await this.isEmailRegistered(email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    await Log.create({ userId: newUser.id, action: 'REGISTER' });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    return token;
  }
}

export default new AuthService();
