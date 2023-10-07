import gql from 'graphql-tag';

const typeDefs = gql`
	type User {
		id: String
		username: String
	}

	type CreateUsernameResponse {
		success: Boolean
		error: String
	}

	type Query {
		searchUser(username: String): [User]
	}

	type Mutation {
		createUsername(username: String): CreateUsernameResponse
	}
`;

export default typeDefs;
