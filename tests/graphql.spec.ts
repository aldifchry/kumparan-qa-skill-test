import { test, expect } from '@playwright/test';

const endpoint = 'https://graphqlzero.almansi.me/api';

type GraphQLResponse<T = unknown> = { data?: T; errors?: { message: string }[] };

async function gql<T>(request: any, query: string, variables: Record<string, unknown> = {}) {
  const response = await request.post(endpoint, {
    data: { query, variables },
    headers: { 'content-type': 'application/json' }
  });
  expect([200, 400]).toContain(response.status());
  const body = await response.json() as GraphQLResponse<T>;
  return { response, body };
}

test.describe('GraphQLZero API', () => {
  test('API-001: get a user by id', async ({ request }) => {
    const { body } = await gql<{ user: { id: string; name: string } }>(request,
      `query GetUser($id: ID!) { user(id: $id) { id name username email } }`, { id: 1 });
    expect(body.errors).toBeUndefined();
    expect(body.data?.user.id).toBe('1');
    expect(body.data?.user.name).toBeTruthy();
  });

  test('API-002: get a post by id', async ({ request }) => {
    const { body } = await gql<{ post: { id: string; title: string; body: string } }>(request,
      `query GetPost($id: ID!) { post(id: $id) { id title body } }`, { id: 1 });
    expect(body.errors).toBeUndefined();
    expect(body.data?.post.id).toBe('1');
    expect(body.data?.post.title).toBeTruthy();
    expect(body.data?.post.body).toBeTruthy();
  });

  test('API-003: get posts with pagination', async ({ request }) => {
    const { body } = await gql<{ posts: { data: { id: string; title: string }[] } }>(request,
      `query GetPosts($options: PageQueryOptions) { posts(options: $options) { data { id title } } }`,
      { options: { paginate: { page: 1, limit: 5 } } });
    expect(body.errors).toBeUndefined();
    expect(body.data?.posts.data).toHaveLength(5);
  });

  test('API-004: get comments for a post', async ({ request }) => {
    const { body } = await gql<{ post: { comments: { data: { id: string; body: string }[] } } }>(request,
      `query GetPostComments($id: ID!) { post(id: $id) { comments { data { id body } } } }`, { id: 1 });
    expect(body.errors).toBeUndefined();
    expect(body.data?.post.comments.data.length).toBeGreaterThan(0);
  });

  test('API-005: get user posts through nested relationship', async ({ request }) => {
    const { body } = await gql<{ user: { posts: { data: { id: string; title: string }[] } } }>(request,
      `query GetUserPosts($id: ID!) { user(id: $id) { posts { data { id title } } } }`, { id: 1 });
    expect(body.errors).toBeUndefined();
    expect(body.data?.user.posts.data.length).toBeGreaterThan(0);
  });

  test('API-006: invalid resource id returns null data without transport failure', async ({ request }) => {
    const { body } = await gql<{ user: unknown }>(request,
      `query GetUser($id: ID!) { user(id: $id) { id name } }`, { id: 999999 });
    expect(body.errors).toBeUndefined();
    expect(body.data?.user).toEqual({
      id: null,
      name: null,
    });
  });

  test('API-007: invalid GraphQL field returns errors', async ({ request }) => {
    const { body } = await gql(request,
      `query InvalidField { user(id: 1) { id fieldThatDoesNotExist } }`);
    expect(body.errors?.length).toBeGreaterThan(0);
    expect(body.errors?.[0].message).toMatch(/Cannot query field/i);
  });
});
