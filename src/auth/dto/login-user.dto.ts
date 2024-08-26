import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, MinLength, MaxLength, Matches } from "class-validator";

export class LoginUserDto {

    @ApiProperty({
        example: 'test@google.com',
        description:'User email',
        required: true
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Abc123',
        description:'User Password',
        required: true
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

}
