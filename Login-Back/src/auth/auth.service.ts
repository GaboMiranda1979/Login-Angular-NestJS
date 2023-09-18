import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { Model } from 'mongoose';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash, compare } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(userObject: RegisterAuthDto) {
    const { password } = userObject;
    const plainToHash = await hash(password, 10);
    userObject = { ...userObject, password: plainToHash };

    return this.userModel.create(userObject);
  }

  async login(userObjectLogin: LoginAuthDto) {
    const { email, password } = userObjectLogin;
    const findUser = await this.userModel.findOne({ email });
    if (!findUser) {
      throw new HttpException('User_Not_Found', 404);
    }

    const checkPassword = await compare(password, findUser.password);

    if (!checkPassword) {
      throw new HttpException('Invalid_Credentials', 403);
    }

    const payload = { id: findUser._id, name: findUser.name };
    const token = this.jwtService.sign(payload);
    const data = {
      user: findUser,
      token,
    };
    return data;
  }
}
