import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './create-user.dto';

export class UserUpdateDto extends PartialType(UserDto) {}
