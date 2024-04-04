import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class AuthDto {

    @IsString()
    firstName?: string;
    @IsString()
    lastName?:string;

    @IsEmail({}, { message: 'Email must be valid' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
    password : string;
}