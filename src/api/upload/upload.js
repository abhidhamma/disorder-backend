import { prisma } from '../../../generated/prisma-client';
export default {
  Mutation: {
    upload: async (_, args, { request, isAuthenticated }) => {
      try {
        isAuthenticated(request);
        const { user } = request;
        const { caption, files, title } = args;
        const post = await prisma.createPost({
          caption,
          title,
          user: { connect: { id: user.id } },
        });
        console.log('files : ', files);
        console.log('compare : ', files[0] === '');
        if (files[0] === '') {
          const random = Math.floor(Math.random() * 24);
          const randomImage = `../../../uploads/${random}.jpg`;
          await prisma.createFile({
            url: randomImage,
            post: {
              connect: {
                id: post.id,
              },
            },
          });
        } else {
          files.forEach(
            async file =>
              await prisma.createFile({
                url: file,
                post: {
                  connect: {
                    id: post.id,
                  },
                },
              })
          );
        }

        return post;
      } catch (e) {
        console.log(e);
      }
      return false;
    },
  },
};
