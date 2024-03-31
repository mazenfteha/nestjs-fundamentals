import { CreateUserDto } from "./create-user.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    username?: string;
    email?: string;
    country?: string;
    password?: string;
}