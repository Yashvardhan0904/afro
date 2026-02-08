import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const TEST_QUERY = gql`
  query {
    categories {
      id
      name
      slug
    }
  }
`;

export default function GraphQLTest() {
  const { loading, error, data } = useQuery(TEST_QUERY);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GraphQL Connection Test</h1>
      <p className="text-green-600 mb-4">✅ Connected to GraphQL API!</p>
      
      <h2 className="text-xl font-semibold mb-2">Categories:</h2>
      <ul className="list-disc pl-6">
        {data?.categories?.map((cat: any) => (
          <li key={cat.id}>{cat.name} ({cat.slug})</li>
        ))}
      </ul>
    </div>
  );
}
