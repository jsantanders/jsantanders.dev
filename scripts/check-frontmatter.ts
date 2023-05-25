import matter from "gray-matter";
import Joi from "joi";

const [, , ...blogs] = process.argv;

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  isPublished: Joi.boolean().required(),
  publishedAt: Joi.when("isPublished", {
    is: true,
    then: Joi.string().required().isoDate(),
  }),
  tags: Joi.array().items(Joi.string()).required(),
  category: Joi.string().required(),
});

blogs.forEach(async (blog) => {
  const { data } = matter.read(blog);
  const { error } = schema.validate(data);

  if (error) {
    // eslint-disable-next-line no-console
    process.exit(1);
  }
});
