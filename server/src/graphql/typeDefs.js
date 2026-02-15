import gql from 'graphql-tag';

export default gql`
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    subscription: Subscription
    createdAt: String!
  }

  type Subscription {
    lemonSqueezyId: String
    status: String!
    plan: String
    currentPeriodEnd: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type AdminStats {
    totalUsers: Int!
    activeSubscriptions: Int!
    recentUsers: [User!]!
  }

  type Query {
    me: User
    adminStats: AdminStats!
    users(limit: Int, offset: Int): [User!]!
  }

  type Mutation {
    register(email: String!, password: String!, name: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createCheckoutUrl(variantId: String!): String!
    cancelSubscription: Boolean!
  }
`;
