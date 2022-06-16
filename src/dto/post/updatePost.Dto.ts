export class UpdatePostDto {
  constructor(
    public id: number,
    public title: string,
    public authorId: number,
    public content: string,
    public published: boolean
  ) {}
}
