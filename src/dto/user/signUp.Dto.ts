import { CreatePostDto } from "../post/createPost.Dto";

export class SignUpDto {
    constructor(
      public name: string,
      public email: string,
      public posts: any,
      public password:string
    ) {}
  }
  