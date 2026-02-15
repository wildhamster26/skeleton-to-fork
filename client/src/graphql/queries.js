import { gql } from '@apollo/client';

export const ME = gql`
  query Me {
    me {
      id
      email
      name
      role
      subscription {
        status
        plan
        currentPeriodEnd
      }
    }
  }
`;

export const ADMIN_STATS = gql`
  query AdminStats {
    adminStats {
      totalUsers
      activeSubscriptions
      recentUsers {
        id
        email
        name
        role
        createdAt
      }
    }
  }
`;

export const USERS = gql`
  query Users($limit: Int, $offset: Int) {
    users(limit: $limit, offset: $offset) {
      id
      email
      name
      role
      subscription {
        status
        plan
      }
      createdAt
    }
  }
`;
