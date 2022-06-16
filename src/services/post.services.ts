import { UpdatePostDto } from "../dto/post/updatePost.Dto";
import { Post, Prisma, PrismaClient } from "@prisma/client";
import { CreatePostDto } from "../dto/post/createPost.Dto";
import { PageList } from "../core/pageList";

const prisma = new PrismaClient();

const createPost = async (post: CreatePostDto) => {
  let { title, content, authorEmail } = post;

  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorEmail } },
    },
  });

  return result;
};

const publishPost = async (id: number) => {
  try {
    const postData = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: {
        published: true,
      },
    });

    if (postData === null) {
      throw Error(`${id} id is not an existing post`);
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) || undefined },
      data: { published: !postData?.published },
    });
    return updatedPost;
  } catch (error: any) {
    throw error;
  }
};

const updatePost = async (post: UpdatePostDto) => {
  let { id, authorId, title, content, published } = post;
  try {
    const prevPost = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (prevPost === null) {
      throw Error(`Post with ID ${id} does not exist in the database`);
    }

    const authorToReplace = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (authorToReplace === null) {
      throw Error(`Unable to replace non-existing author:${authorId}`);
    }

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title: title,
        authorId: authorId,
        content: content,
        published: Boolean(published),
        viewCount: prevPost?.viewCount != null ? prevPost.viewCount + 1 : 1,
      },
    });
    return post;
  } catch (err: any) {
    throw err;
  }
};

const getPostViaId = async (id?: string) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });
  return post;
};

const deletePost = async (id?: string) => {
  const prevPost = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (prevPost === null) {
    throw Error(`Post with ID ${id} does not exist in the database`);
  }

  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });
  return post;
};

const getFeed = async (pageList: PageList<Post>) => {
  const { searchString, skip, take, orderBy } = pageList;

  const or: Prisma.PostWhereInput = searchString
    ? {
        OR: [
          { title: { contains: searchString as string } },
          { content: { contains: searchString as string } },
        ],
      }
    : {};

  const posts = await prisma.post.findMany({
    select: {
      title: true,
      content: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      viewCount: true,
      published: true,
      authorId: true,
      author: {
        select: {
          email: true,
          id: true,
          name: true,
        },
      },
    },
    where: {
      published: true,
      ...or,
    },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy as Prisma.SortOrder,
    },
  });

  pageList.data = posts;
  return pageList;
};

export default {
  getPostViaId,
  updatePost,
  publishPost,
  createPost,
  deletePost,
  getFeed,
};
