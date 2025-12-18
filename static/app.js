async function flip(guess) {
  // Disable buttons during flip
  document.getElementById('heads-btn').disabled = true;
  document.getElementById('tails-btn').disabled = true;
  
  // Clear previous result
  const resultEl = document.getElementById('result');
  resultEl.innerText = '';
  resultEl.className = '';
  
  // Start coin flip animation
  const coin = document.getElementById('coin');
  coin.classList.add('flipping');
  
  // Fetch the result
  const res = await fetch('/flip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guess })
  });

  const data = await res.json();
  
  // Wait for animation to complete
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Stop animation and show final side
  coin.classList.remove('flipping');
  
  // Rotate coin to show the result
  if (data.coin_result === 'heads') {
    coin.style.transform = 'rotateY(0deg)';
  } else {
    coin.style.transform = 'rotateY(180deg)';
  }
  
  // Wait a bit before showing text result
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Determine if guess was correct
  const isCorrect = data.your_guess === data.coin_result;
  
  // Display result with color
  resultEl.innerText = `You guessed ${data.your_guess}. Coin was ${data.coin_result}.`;
  resultEl.className = isCorrect ? 'correct' : 'incorrect';

  document.getElementById('stats').innerText =
    `Right: ${data.stats.right} | Wrong: ${data.stats.wrong} | Accuracy: ${(data.stats.accuracy * 100).toFixed(1)}%`;
  
  // Re-enable buttons
  document.getElementById('heads-btn').disabled = false;
  document.getElementById('tails-btn').disabled = false;
}
