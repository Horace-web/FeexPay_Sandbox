export default async function TestPage() {
  const res = await fetch('http://localhost:3001', {
    cache: 'no-store',
  });
  const data = await res.text();

  return (
    <div>
      <h1>Réponse du backend :</h1>
      <p>{data}</p>
    </div>
  );
}