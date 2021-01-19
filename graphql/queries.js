/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserInfo = /* GraphQL */ `
  query GetUserInfo($id: ID!) {
    getUserInfo(id: $id) {
      id
      calories
      carbs
      proteins
      fats
      createdAt
      updatedAt
    }
  }
`;
export const listUserInfos = /* GraphQL */ `
  query ListUserInfos(
    $filter: ModelUserInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserInfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        calories
        carbs
        proteins
        fats
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
