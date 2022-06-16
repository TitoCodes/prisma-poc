export class CreatePostDto {
  constructor(
    public title: string,
    public content: string,
    public authorEmail: string
  ) {}
}
