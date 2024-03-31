import { IsEmail, IsString, Length } from 'class-validator';



export class CreateUserDto {
    @IsString()
    @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
    username: string;

    @IsString()
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    @IsString()
    @Length(3, 20, { message: 'Country must be between 3 and 20 characters' })
    country: string;

    @IsString()
    @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
    password: string;
}
