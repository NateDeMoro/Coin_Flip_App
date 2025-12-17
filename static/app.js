async function flip(guess) {
  const res = await fetch('/flip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guess })
  });

  const data = await res.json();

  document.getElementById('result').innerText =
    `You guessed ${data.your_guess}. Coin was ${data.coin_result}.`;

  document.getElementById('stats').innerText =
    `Right: ${data.stats.right} | Wrong: ${data.stats.wrong} | Accuracy: ${(data.stats.accuracy * 100).toFixed(1)}%`;
}
