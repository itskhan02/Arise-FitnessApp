// Suppose service: chatApi.js
export async function sendMessageApi(userMessage, history) {
  const res = await fetch(`${VITE_API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage, history }),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  const data = await res.json();
  return data.reply;
}
