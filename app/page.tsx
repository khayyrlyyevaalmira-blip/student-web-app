import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';
import { connection } from 'next/server';
export const instant = false;
async function addMessage(formData: FormData) {
  'use server';

  const message = String(formData.get('message') ?? '').trim();

  if (message.length === 0 || message.length > 300) {
    return;
  }

  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    INSERT INTO messages (message)
    VALUES (${message})
  `;

  revalidatePath('/');
}

export default async function Home() {
  await connection();

  const sql = neon(process.env.DATABASE_URL!);

  const messages = await sql`
    SELECT id, message
    FROM messages
    ORDER BY id DESC
  `;

  return (
    <main
      style={{
        maxWidth: '700px',
        margin: '50px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>
        Менің алғашқы веб-қосымшам
      </h1>

      <form
        action={addMessage}
        style={{ display: 'grid', gap: '8px', marginTop: '20px' }}
      >
        <label htmlFor="message">Хабарлама мәтіні</label>
        <input
          id="message"
          name="message"
          placeholder="Хабарлама енгізіңіз"
          required
          maxLength={300}
          style={{ padding: '10px', border: '1px solid #888' }}
        />
        <button
          type="submit"
          style={{
            justifySelf: 'start',
            padding: '8px 16px',
            background: '#1d4ed8',
            color: 'white',
            borderRadius: '6px',
          }}
        >
          Сақтау
        </button>
      </form>

      <h2 style={{ marginTop: '24px', fontWeight: 'bold' }}>
        Хабарламалар тізімі
      </h2>

      <ul>
        {messages.map((item) => (
          <li
            key={item.id}
            style={{
              marginTop: '8px',
              padding: '10px',
              background: '#f1f5f9',
              color: '#0f172a',
              overflowWrap: 'anywhere',
            }}
          >
            {item.message}
          </li>
        ))}
      </ul>
    </main>
  );
}