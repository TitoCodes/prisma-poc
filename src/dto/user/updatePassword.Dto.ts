export class UpdatePasswordDto {
    constructor(
      public email: string,
      public newPassword: string,
      public oldPassword:string
    ) {}
  }
  