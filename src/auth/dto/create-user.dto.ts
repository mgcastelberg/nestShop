import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        example: 'test@google.com',
        description:'User email',
        required: true
    })
    @IsString()
    @IsEmail()
    email: string;
    
    @ApiProperty({
        example: 'Manuel Gómez',
        description:'User full name',
        required: true
    })
    @IsString()
    @MinLength(6)
    fullName: string;

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
