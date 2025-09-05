import { Post, PostsService } from './posts.service';

describe('PostsService', () => {
  let postsService: PostsService;
  const post: Omit<Post, 'id' | 'date'> = {
    text: 'Mocked post',
  };

  beforeEach(() => {
    postsService = new PostsService();
    postsService.create({ text: 'Some pre-existing post' });
  });

  it('should add a new post', () => {
    const created = postsService.create(post);

    // проверяем форму созданного поста
    expect(created).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        text: post.text,
        date: expect.any(String),
      })
    );
    expect(typeof created.date).toBe('string');
    expect(Date.parse(created.date as string)).not.toBeNaN();

    // проверяем, что пост можно получить по id
    const getById = (service: any, id: string | number) => {
      if (typeof service.findOne === 'function') return service.findOne(id);
      if (typeof service.find === 'function') return service.find(id);
      if (typeof service.findById === 'function') return service.findById(id);
      if (typeof service.get === 'function') return service.get(id);
      if (typeof service.getById === 'function') return service.getById(id);
      return undefined;
    };

    const fetched = getById(postsService as any, created.id);
    expect(fetched).toEqual(created);
  });

  it('should find a post', () => {
    const created = postsService.create({ text: 'Find me' });

    const service: any = postsService as any;
    const found: any =
      (typeof service.findOne === 'function' && service.findOne(created.id)) ||
      (typeof service.find === 'function' && service.find(created.id)) ||
      (typeof service.findById === 'function' &&
        service.findById(created.id)) ||
      (typeof service.get === 'function' && service.get(created.id)) ||
      (typeof service.getById === 'function' && service.getById(created.id));

    expect(found).toEqual(created);
  });
});
