import express from "express";
import verifyToken from "../middleware/verifyToken";
import postServices from "../services/post.services";
import { UpdatePostDto } from "../dto/post/updatePost.Dto";
import errorHandler from "../middleware/errorHandler";
import { CreatePostDto } from "../dto/post/createPost.Dto";
import { PageList } from "../core/pageList";
import { Post } from "@prisma/client";

const router = express.Router();

router.get("/feed", async (req: any, res: any) => {
  const { searchString, skip, take, orderBy } = req.query;

  postServices.getFeed(new PageList<Post>(searchString, Number(take), Number(skip),orderBy))
  .then((result) =>{
    res.json(result)
  })
  .catch((error)=>{
    errorHandler(error, res)
  })
})

router.get(`/post/:id`, async (req: any, res: any) => {
  const { id }: { id?: string } = req.params;

  postServices
    .getPostViaId(id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.delete(`/post/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  postServices
    .deletePost(id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.put("/post/publish/:id", async (req: any, res: any) => {
  const { id } = req.params;

  postServices
    .publishPost(id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.post(`/post`, verifyToken, async (req: any, res: any) => {
  const { title, content, authorEmail } = req.body;
  await postServices
    .createPost(new CreatePostDto(title, content, authorEmail))
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      errorHandler(err, res);
    });
});

router.put("/post/:id/views", verifyToken, async (req: any, res: any) => {
  const { id } = req.params;
  const { title, content, published, authorId } = req.body;

  await postServices
    .updatePost(new UpdatePostDto(id, title, authorId, content, published))
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      errorHandler(err, res);
    });
});

export default router;
